const permissions = {
  // Dashboard
  dashboard: {
    view: "dashboard.view",
  },

  // Users Management
  users: {
    view: "users.view",
    create: "users.create",
    edit: "users.update",
    delete: "users.delete",
    restore: "users.restore",
    forceDelete: "users.force_delete",
    resetPassword: "users.reset_password",
  },

  // Roles Management
  roles: {
    view: "roles.view",
    create: "roles.create",
    edit: "roles.update",
    delete: "roles.delete",
    assignPermissions: "roles.assign_permissions",
  },

  // Categories Management
  categories: {
    view: "categories.view",
    create: "categories.create",
    edit: "categories.update",
    delete: "categories.delete",
  },

  activity_logs: {
    view: "activity_logs.view",
    view_own: "activity_logs.view_own",
  },

  // Products Management
  products: {
    view: "products.view",
    create: "products.create",
    edit: "products.update",
    delete: "products.delete",
  },

  // Packages Management
  packages: {
    view: "packages.view",
    create: "packages.create",
    edit: "packages.update",
    delete: "packages.delete",
  },

  package_schedule_options: {
    view: "package_schedule_options.view",
    create: "package_schedule_options.create",
    edit: "package_schedule_options.update",
    delete: "package_schedule_options.delete",
  },

  // Orders Management
  orders: {
    view: "orders.view",
    create: "orders.create",
    edit: "orders.update",
    manage: "orders.manage",
    modify_items: "orders.modify_items",
    delete: "orders.delete",
    updateStatus: "orders.update_status",
    updateDeliveryTime: "orders.update_delivery_time",
  },

  // Delivery Management
  delivery: {
    view: "delivery.view",
    create: "delivery.create",
    edit: "delivery.update",
    delete: "delivery.delete",
    assignAgent: "delivery.assign_agent",
    track: "delivery.track",
  },

  // Coverage Areas
  coverageAreas: {
    view: "coverage_areas.view",
    create: "coverage_areas.create",
    edit: "coverage_areas.update",
    delete: "coverage_areas.delete",
    bulk_action: "coverage_areas.bulk_action",
  },

  // Financial
  transactions: {
    view: "transactions.view",
    export: "transactions.export",
    refund: "transactions.refund",
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

  // Support
  support: {
    view: "support.view",
    respond: "support.respond",
  },

  // Analytics
  analytics: {
    view: "analytics.view",
    export: "analytics.export",
  },

  // Coupons
  coupons: {
    view: "coupons.view",
    create: "coupons.create",
    edit: "coupons.update",
    delete: "coupons.delete",
  },

  coins: {
    view: "coins.view",
    manage: "coins.manage",
    send: "coins.send",
    view_transactions: "coins.view_transactions",
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

  // donations
  donations: {
    view: "donations.view",
    create: "donations.create",
    edit: "donations.update",
    delete: "donations.delete",
    manage: "donations.manage",
  },

  // Notifications
  notifications: {
    view: "notifications.view",
    create: "notifications.create",
    send: "notifications.send",
  },

  // Settings
  settings: {
    view: "settings.view",
    create: "settings.create",
    edit: "settings.update",
    delete: "settings.delete",
  },

  // Reports
  reports: {
    view: "reports.view",
    export: "reports.export",
  },

  subscriptions: {
    view: "subscriptions.view",
    create: "subscriptions.create",
    edit: "subscriptions.update",
    delete: "subscriptions.delete",
    settings: "subscriptions.manage_settings",
  },

  // Referrals
  referrals: {
    view: "referrals.view",
    manage: "referrals.manage",
  },
};

export default permissions;
