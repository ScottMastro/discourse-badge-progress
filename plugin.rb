# frozen_string_literal: true

# name: discourse-badge-progress
# about: Extending the badges, showing progress
# version: 0.0.1
# authors: ScottMastro
# url: https://github.com/ScottMastro/discourse-badge-progress
# transpile_js: true

enabled_site_setting :badge_extension_enabled

register_asset 'stylesheets/common/my_badges.scss'
register_asset 'stylesheets/mobile/my_badges_mobile.scss', :mobile

register_asset 'stylesheets/common/admin_badges.scss'


after_initialize do

  module ::BadgeExtension
    PLUGIN_NAME = "discourse-badge-extension"
  end

  class BadgeExtension::Engine < Rails::Engine
    engine_name BadgeExtension::PLUGIN_NAME
    isolate_namespace BadgeExtension
  end

  require_relative 'app/controllers/badge_extension_controller.rb'
  require_relative 'app/controllers/admin_badge_extension_controller.rb'

  BadgeExtension::Engine.routes.draw do
    get '/mybadges' => 'badge_extension#my_badges'
    #get '/admin/badge_extension' => 'admin_badge_extension#index', constraints: StaffConstraint.new
    get '/admin/badge_extension/group/:group_id' => 'admin_badge_extension#get_group_info', constraints: StaffConstraint.new
    post '/admin/badge_extension/save' => 'admin_badge_extension#save', constraints: StaffConstraint.new

    get '/admin/badge_extension/badge/:badge_id' => 'admin_badge_extension#get_badge_info', constraints: StaffConstraint.new

  end
  
  Discourse::Application.routes.append do
    mount BadgeExtension::Engine, at: "/"
  end


end
