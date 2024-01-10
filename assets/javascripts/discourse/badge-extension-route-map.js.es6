export default function() {
  this.route('badge_extension', { path: '/mybadges' });
  this.route('adminBadgeExtension', { path: '/admin/mybadges' });

  this.route(
    "adminBadgeExtension",
    { path: "/mybadges", resetNamespace: true },
    function () {
      this.route("show", { path: "/:badge_id" });
    }
  );
}
