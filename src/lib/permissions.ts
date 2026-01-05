const permissions = {
  // activity_logs
  activity_logs: {
    view: "activity_logs.view",
    view_own: "activity_logs.view_own",
  },

  // banners
  banners: {
    create: "banners.create",
    reorder: "banners.reorder",
    view: "banners.view",
    edit: "banners.update",
    delete: "banners.delete",
  },

  brands: {
    view: "brands.view",
    create: "brands.create",
    edit: "brands.update",
    delete: "brands.delete",
    reorder: "brands.reorder",
  },

  // Categories Management
  categories: {
    view: "categories.view",
    create: "categories.create",
    edit: "categories.update",
    delete: "categories.delete",
  },

  coins: {
    view: "coins.view",
    manage: "coins.manage",
    send: "coins.send",
    view_transactions: "coins.view_transactions",
  },

  // Coupons
  coupons: {
    view: "coupons.view",
    create: "coupons.create",
    edit: "coupons.update",
    delete: "coupons.delete",
  },

  // Coverage Areas
  coverageAreas: {
    view: "coverage_areas.view",
    create: "coverage_areas.create",
    edit: "coverage_areas.update",
    delete: "coverage_areas.delete",
    bulk_action: "coverage_areas.bulk_action",
  },

  // donations
  donations: {
    view: "donations.view",
    create: "donations.create",
    edit: "donations.update",
    delete: "donations.delete",
    manage: "donations.manage",
  },

  legal_documents: {
    create: "legal_documents.create",
    view: "legal_documents.view",
    edit: "legal_documents.update",
    delete: "legal_documents.delete",
  },

  // Notifications
  notifications: {
    view: "notifications.view",
    send: "notifications.send",
    delete: "notifications.delete",
    test: "notifications.test",
  },

  // Orders Management
  orders: {
    delete: "orders.delete",
    manage: "orders.manage",
    modify_items: "orders.modify_items",
    refund: "orders.refund",
    edit: "orders.update",
    view: "orders.view",
  },

  package_schedule_options: {
    view: "package_schedule_options.view",
    create: "package_schedule_options.create",
    edit: "package_schedule_options.update",
    delete: "package_schedule_options.delete",
  },

  // Packages Management
  packages: {
    view: "packages.view",
    create: "packages.create",
    edit: "packages.update",
    delete: "packages.delete",
  },

  // Products Management
  products: {
    view: "products.view",
    create: "products.create",
    edit: "products.update",
    delete: "products.delete",
  },

  // Referrals
  referrals: {
    view: "referrals.view",
    manage: "referrals.manage",
    update_settings: "referrals.update_settings",
    view_settings: "referrals.view_settings",
  },

  // Roles Management
  roles: {
    view: "roles.view",
    create: "roles.create",
    edit: "roles.update",
    delete: "roles.delete",
    assignPermissions: "roles.assign_permissions",
  },

  // Settings
  settings: {
    view: "settings.view",
    create: "settings.create",
    edit: "settings.update",
    delete: "settings.delete",
  },

  subscriptions: {
    view: "subscriptions.view",
    edit: "subscriptions.update",
    delete: "subscriptions.delete",
    settings: "subscriptions.manage_settings",
  },

  // Support
  support: {
    create: "support.create",
    delete: "support.delete",
    edit: "support.edit",
    manage: "support.manage",
    view: "support.view",
    search: "support.search",
  },

  // Financial
  transactions: {
    export: "transactions.export",
    refund: "transactions.refund",
    view: "transactions.view",
  },

  // Users Management
  users: {
    create: "users.create",
    delete: "users.delete",
    forceDelete: "users.force_delete",
    resetPassword: "users.reset_password",
    restore: "users.restore",
    edit: "users.update",
    view: "users.view",
  },

  // Dashboard
  dashboard: {
    view: "dashboard.view",
  },
  // ---------------------------------- Extra ---------------------------------- //
  // Delivery Management
  delivery: {
    view: "delivery.view",
    create: "delivery.create",
    edit: "delivery.update",
    delete: "delivery.delete",
    assignAgent: "delivery.assign_agent",
    track: "delivery.track",
  },

  // Loyalty & Rewards
  coinManagement: {
    view: "coin_management.view",
    create: "coin_management.create",
    edit: "coin_management.update",
    delete: "coin_management.delete",
  },

  // Marketing
  marketing: {
    view: "marketing.view",
    create: "marketing.create",
    edit: "marketing.update",
    delete: "marketing.delete",
  },

  // Analytics
  analytics: {
    view: "analytics.view",
    export: "analytics.export",
  },

  // Content Management
  content: {
    view: "content.view",
    create: "content.create",
    edit: "content.update",
    delete: "content.delete",
  },

  // Family Accounts
  family: {
    view: "family.view",
    create: "family.create",
    edit: "family.update",
    delete: "family.delete",
  },

  // Returns & Refunds
  returns: {
    view: "returns.view",
    approve: "returns.approve",
    reject: "returns.reject",
  },

  // Reports
  reports: {
    view: "reports.view",
    export: "reports.export",
  },
};

export default permissions;
