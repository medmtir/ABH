const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('Error: DATABASE_URL or POSTGRES_URL environment variable is required.');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  console.log('Connecting to Neon PostgreSQL...');
  const client = await pool.connect();
  console.log('Connected to Neon successfully!');

  try {
    console.log('Creating tables in Neon...');

    // 1. Admin Users
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Products
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        active BOOLEAN DEFAULT true,
        acidity_max NUMERIC(3,2) DEFAULT 0.8,
        hero_image TEXT NOT NULL,
        gallery_images JSONB DEFAULT '[]'::jsonb,
        specs JSONB NOT NULL DEFAULT '{}'::jsonb,
        certifications JSONB DEFAULT '[]'::jsonb,
        translations JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. Certifications
    await client.query(`
      CREATE TABLE IF NOT EXISTS certifications (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        logo TEXT NOT NULL,
        active BOOLEAN DEFAULT true,
        expiry_date DATE,
        pdf_url TEXT,
        translations JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 4. Packagings
    await client.query(`
      CREATE TABLE IF NOT EXISTS packagings (
        id TEXT PRIMARY KEY,
        capacity TEXT NOT NULL,
        title TEXT NOT NULL,
        image_url TEXT NOT NULL,
        badge TEXT DEFAULT '',
        description TEXT DEFAULT '',
        sort_order INT DEFAULT 1,
        is_active BOOLEAN DEFAULT true,
        translations JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 5. Contact Messages / RFQ
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        company_name TEXT NOT NULL,
        country TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        product_interest TEXT NOT NULL,
        quantity TEXT,
        destination_country TEXT,
        message TEXT NOT NULL,
        privacy_consent BOOLEAN DEFAULT true,
        file_attachment TEXT,
        status TEXT DEFAULT 'unread',
        admin_notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        trashed_at TIMESTAMPTZ
      );
    `);

    // 6. Clients
    await client.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        tax_id TEXT,
        contact_person TEXT,
        email TEXT,
        phone TEXT,
        country TEXT NOT NULL,
        address TEXT,
        notes TEXT,
        is_deleted BOOLEAN DEFAULT false,
        deleted_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 7. Orders
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        order_number TEXT UNIQUE NOT NULL,
        client_id TEXT,
        client_name TEXT NOT NULL,
        product_id TEXT,
        product_name TEXT NOT NULL,
        packaging TEXT NOT NULL,
        quantity NUMERIC(10,2) NOT NULL,
        unit TEXT NOT NULL DEFAULT 'tonnes',
        unit_price NUMERIC(12,2) NOT NULL,
        currency TEXT NOT NULL DEFAULT 'EUR',
        total_amount NUMERIC(12,2) NOT NULL,
        paid_amount NUMERIC(12,2) DEFAULT 0,
        remaining_amount NUMERIC(12,2) NOT NULL,
        payment_status TEXT DEFAULT 'unpaid',
        order_status TEXT DEFAULT 'confirmed',
        order_date DATE DEFAULT CURRENT_DATE,
        payments JSONB DEFAULT '[]'::jsonb,
        delivery_installments JSONB DEFAULT '[]'::jsonb,
        delivered_quantity NUMERIC(10,2) DEFAULT 0,
        remaining_quantity NUMERIC(10,2) NOT NULL,
        delivery_status TEXT DEFAULT 'pending',
        is_deleted BOOLEAN DEFAULT false,
        deleted_at TIMESTAMPTZ,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 8. Site Settings
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT PRIMARY KEY DEFAULT 1,
        company_name TEXT NOT NULL,
        tagline TEXT,
        country TEXT DEFAULT 'Tunisie',
        address TEXT,
        general_email TEXT,
        general_phone TEXT,
        whatsapp TEXT,
        developer_credit JSONB DEFAULT '{}'::jsonb,
        partners JSONB DEFAULT '[]'::jsonb,
        social_links JSONB DEFAULT '{}'::jsonb,
        seo JSONB DEFAULT '{}'::jsonb,
        google_site_verification TEXT,
        bing_site_verification TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 9. Content Blocks
    await client.query(`
      CREATE TABLE IF NOT EXISTS content_blocks (
        locale TEXT PRIMARY KEY,
        hero_title TEXT,
        hero_subtitle TEXT,
        hero_badge TEXT,
        hero_cta_primary TEXT,
        hero_cta_secondary TEXT,
        about_title TEXT,
        about_subtitle TEXT,
        about_text TEXT,
        why_choose_title TEXT,
        why_choose_subtitle TEXT,
        export_title TEXT,
        export_subtitle TEXT,
        export_text TEXT,
        about_who_we_are TEXT,
        about_mission TEXT,
        about_vision TEXT,
        about_mill_heritage TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 10. Publications
    await client.query(`
      CREATE TABLE IF NOT EXISTS publications (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        date DATE NOT NULL,
        download_url TEXT,
        file_size TEXT,
        translations JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 11. Sync state table for atomic app persistence
    await client.query(`
      CREATE TABLE IF NOT EXISTS app_database_sync (
        key TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('All tables created successfully in Neon!');

    // Read current data from abh.db.json
    const dbPath = path.join(__dirname, '..', 'data', 'abh.db.json');
    if (!fs.existsSync(dbPath)) {
      console.log('abh.db.json not found, skipping seed.');
      return;
    }

    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    console.log('Migrating data from data/abh.db.json to Neon...');

    // 1. Sync full snapshot into app_database_sync
    await client.query(
      `
      INSERT INTO app_database_sync (key, data, updated_at)
      VALUES ('abh_master', $1, NOW())
      ON CONFLICT (key) DO UPDATE SET data = $1, updated_at = NOW();
    `,
      [JSON.stringify(db)]
    );

    // 2. Seed Admin Users
    if (Array.isArray(db.admins)) {
      for (const a of db.admins) {
        await client.query(
          `
          INSERT INTO admin_users (id, email, password_hash, name, role, created_at)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO UPDATE SET email = $2, password_hash = $3, name = $4, role = $5;
        `,
          [a.id, a.email, a.password_hash, a.name, a.role || 'admin', a.created_at || new Date()]
        );
      }
      console.log(`Seeded ${db.admins.length} admin user(s).`);
    }

    // 3. Seed Products
    if (Array.isArray(db.products)) {
      for (const p of db.products) {
        await client.query(
          `
          INSERT INTO products (id, slug, active, acidity_max, hero_image, gallery_images, specs, certifications, translations, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO UPDATE SET
            slug = $2, active = $3, acidity_max = $4, hero_image = $5,
            gallery_images = $6, specs = $7, certifications = $8, translations = $9;
        `,
          [
            p.id,
            p.slug,
            p.active !== false,
            p.acidity_max || 0.8,
            p.hero_image,
            JSON.stringify(p.gallery_images || []),
            JSON.stringify(p.specs || {}),
            JSON.stringify(p.certifications || []),
            JSON.stringify(p.translations || {}),
            p.created_at || new Date(),
          ]
        );
      }
      console.log(`Seeded ${db.products.length} product(s).`);
    }

    // 4. Seed Certifications
    if (Array.isArray(db.certifications)) {
      for (const c of db.certifications) {
        await client.query(
          `
          INSERT INTO certifications (id, slug, logo, active, expiry_date, pdf_url, translations, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO UPDATE SET
            slug = $2, logo = $3, active = $4, expiry_date = $5, pdf_url = $6, translations = $7;
        `,
          [
            c.id,
            c.slug,
            c.logo,
            c.active !== false,
            c.expiry_date || null,
            c.pdf_url || null,
            JSON.stringify(c.translations || {}),
            c.created_at || new Date(),
          ]
        );
      }
      console.log(`Seeded ${db.certifications.length} certification(s).`);
    }

    // 5. Seed Packagings
    if (Array.isArray(db.packagings)) {
      for (const pk of db.packagings) {
        await client.query(
          `
          INSERT INTO packagings (id, capacity, title, image_url, badge, description, sort_order, is_active, translations, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO UPDATE SET
            capacity = $2, title = $3, image_url = $4, badge = $5, description = $6, sort_order = $7, is_active = $8, translations = $9;
        `,
          [
            pk.id,
            pk.capacity,
            pk.title,
            pk.image_url,
            pk.badge || '',
            pk.description || '',
            pk.sort_order || 1,
            pk.is_active !== false,
            JSON.stringify(pk.translations || {}),
            pk.created_at || new Date(),
          ]
        );
      }
      console.log(`Seeded ${db.packagings.length} packaging(s).`);
    }

    // 6. Seed Clients
    if (Array.isArray(db.clients)) {
      for (const cl of db.clients) {
        await client.query(
          `
          INSERT INTO clients (id, name, tax_id, contact_person, email, phone, country, address, notes, is_deleted, deleted_at, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (id) DO UPDATE SET
            name = $2, tax_id = $3, contact_person = $4, email = $5, phone = $6,
            country = $7, address = $8, notes = $9, is_deleted = $10, deleted_at = $11;
        `,
          [
            cl.id,
            cl.name,
            cl.tax_id || null,
            cl.contact_person || null,
            cl.email || null,
            cl.phone || null,
            cl.country,
            cl.address || null,
            cl.notes || null,
            cl.is_deleted || false,
            cl.deleted_at || null,
            cl.created_at || new Date(),
          ]
        );
      }
      console.log(`Seeded ${db.clients.length} client(s).`);
    }

    // 7. Seed Orders
    if (Array.isArray(db.orders)) {
      for (const ord of db.orders) {
        await client.query(
          `
          INSERT INTO orders (
            id, order_number, client_id, client_name, product_id, product_name, packaging,
            quantity, unit, unit_price, currency, total_amount, paid_amount, remaining_amount,
            payment_status, order_status, order_date, payments, delivery_installments,
            delivered_quantity, remaining_quantity, delivery_status, is_deleted, deleted_at, notes, created_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
          ON CONFLICT (id) DO UPDATE SET
            client_id = $3, client_name = $4, product_name = $6, packaging = $7,
            quantity = $8, unit = $9, unit_price = $10, currency = $11, total_amount = $12,
            paid_amount = $13, remaining_amount = $14, payment_status = $15, order_status = $16,
            order_date = $17, payments = $18, delivery_installments = $19, delivered_quantity = $20,
            remaining_quantity = $21, delivery_status = $22, is_deleted = $23, deleted_at = $24, notes = $25;
        `,
          [
            ord.id,
            ord.order_number,
            ord.client_id || '',
            ord.client_name,
            ord.product_id || '',
            ord.product_name,
            ord.packaging,
            ord.quantity,
            ord.unit || 'tonnes',
            ord.unit_price,
            ord.currency || 'EUR',
            ord.total_amount,
            ord.paid_amount || 0,
            ord.remaining_amount,
            ord.payment_status || 'unpaid',
            ord.order_status || 'confirmed',
            ord.order_date || new Date(),
            JSON.stringify(ord.payments || []),
            JSON.stringify(ord.delivery_installments || []),
            ord.delivered_quantity || 0,
            ord.remaining_quantity,
            ord.delivery_status || 'pending',
            ord.is_deleted || false,
            ord.deleted_at || null,
            ord.notes || null,
            ord.created_at || new Date(),
          ]
        );
      }
      console.log(`Seeded ${db.orders.length} order(s).`);
    }

    // 8. Seed Site Settings
    if (db.settings) {
      const s = db.settings;
      await client.query(
        `
        INSERT INTO site_settings (
          id, company_name, tagline, country, address, general_email, general_phone, whatsapp,
          developer_credit, partners, social_links, seo, google_site_verification, bing_site_verification, updated_at
        )
        VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
        ON CONFLICT (id) DO UPDATE SET
          company_name = $1, tagline = $2, country = $3, address = $4,
          general_email = $5, general_phone = $6, whatsapp = $7,
          developer_credit = $8, partners = $9, social_links = $10,
          seo = $11, google_site_verification = $12, bing_site_verification = $13, updated_at = NOW();
      `,
        [
          s.company_name || 'ABH Company',
          s.tagline || '',
          s.country || 'Tunisie',
          s.address || '',
          s.general_email || '',
          s.general_phone || '',
          s.whatsapp || '',
          JSON.stringify(s.developer_credit || {}),
          JSON.stringify(s.partners || []),
          JSON.stringify(s.social_links || {}),
          JSON.stringify(s.seo || {}),
          s.google_site_verification || null,
          s.bing_site_verification || null,
        ]
      );
      console.log('Seeded site settings.');
    }

    // 9. Seed Content Blocks
    if (Array.isArray(db.content_blocks)) {
      for (const cb of db.content_blocks) {
        await client.query(
          `
          INSERT INTO content_blocks (
            locale, hero_title, hero_subtitle, hero_badge, hero_cta_primary, hero_cta_secondary,
            about_title, about_subtitle, about_text, why_choose_title, why_choose_subtitle,
            export_title, export_subtitle, export_text, about_who_we_are, about_mission, about_vision, about_mill_heritage, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW())
          ON CONFLICT (locale) DO UPDATE SET
            hero_title = $2, hero_subtitle = $3, hero_badge = $4, hero_cta_primary = $5, hero_cta_secondary = $6,
            about_title = $7, about_subtitle = $8, about_text = $9, why_choose_title = $10, why_choose_subtitle = $11,
            export_title = $12, export_subtitle = $13, export_text = $14, about_who_we_are = $15, about_mission = $16,
            about_vision = $17, about_mill_heritage = $18, updated_at = NOW();
        `,
          [
            cb.locale,
            cb.hero_title || '',
            cb.hero_subtitle || '',
            cb.hero_badge || '',
            cb.hero_cta_primary || '',
            cb.hero_cta_secondary || '',
            cb.about_title || '',
            cb.about_subtitle || '',
            cb.about_text || '',
            cb.why_choose_title || '',
            cb.why_choose_subtitle || '',
            cb.export_title || '',
            cb.export_subtitle || '',
            cb.export_text || '',
            cb.about_who_we_are || '',
            cb.about_mission || '',
            cb.about_vision || '',
            cb.about_mill_heritage || '',
          ]
        );
      }
      console.log(`Seeded ${db.content_blocks.length} content block(s).`);
    }

    // 10. Seed Publications
    if (Array.isArray(db.publications)) {
      for (const pub of db.publications) {
        await client.query(
          `
          INSERT INTO publications (id, category, date, download_url, file_size, translations, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO UPDATE SET
            category = $2, date = $3, download_url = $4, file_size = $5, translations = $6;
        `,
          [
            pub.id,
            pub.category,
            pub.date || new Date(),
            pub.download_url || null,
            pub.file_size || null,
            JSON.stringify(pub.translations || {}),
            pub.created_at || new Date(),
          ]
        );
      }
      console.log(`Seeded ${db.publications.length} publication(s).`);
    }

    // 11. Seed Messages
    if (Array.isArray(db.messages)) {
      for (const m of db.messages) {
        await client.query(
          `
          INSERT INTO contact_messages (
            id, full_name, company_name, country, email, phone, product_interest,
            quantity, destination_country, message, privacy_consent, file_attachment,
            status, admin_notes, created_at, trashed_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          ON CONFLICT (id) DO UPDATE SET
            status = $13, admin_notes = $14, trashed_at = $16;
        `,
          [
            m.id,
            m.full_name,
            m.company_name,
            m.country,
            m.email,
            m.phone || null,
            m.product_interest,
            m.quantity || null,
            m.destination_country || null,
            m.message,
            m.privacy_consent !== false,
            m.file_attachment || null,
            m.status || 'unread',
            m.admin_notes || null,
            m.created_at || new Date(),
            m.trashed_at || null,
          ]
        );
      }
      console.log(`Seeded ${db.messages.length} contact message(s).`);
    }

    console.log('✅ Neon Database migration & setup completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
