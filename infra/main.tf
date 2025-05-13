
locals {
	service_name = "reticula-web"
}

resource "bunnynet_storage_zone" "cdn" {
	name                 = local.service_name
	zone_tier            = "Standard"
	region               = "UK"
	replication_regions  = ["BR", "NY", "LA", "SG", "SYD"]
	custom_404_file_path = "/index.html"
	rewrite_404_to_200   = true
}

resource "bunnynet_pullzone" "cdn" {
	name         = local.service_name
	cors_enabled = false

	origin {
		type        = "StorageZone"
		storagezone = bunnynet_storage_zone.cdn.id
	}

	routing {
		tier  = "Standard"
		zones = ["AF", "ASIA","EU", "SA", "US"]
	}
}

resource "bunnynet_pullzone_hostname" "bunnynet_cdn" {
	pullzone    = bunnynet_pullzone.cdn.id
	name        = "${local.service_name}.b-cdn.net"
	tls_enabled = true
	force_ssl   = true
}

resource "bunnynet_pullzone_hostname" "reticula" {
	pullzone    = bunnynet_pullzone.cdn.id
	name        = data.bunnynet_dns_zone.dns.domain
	tls_enabled = true
	force_ssl   = true
}
