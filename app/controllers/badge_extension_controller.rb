# frozen_string_literal: true

class BadgeExtension::BadgeExtensionController < ApplicationController

  def my_badges
    user_id = current_user.id
  
    badge_groups = BadgeGrouping.where(show_progress: true).map do |badge_group|
      progress = execute_progress_query(badge_group.progress_query, user_id).to_f

      # Fetch badges associated with the current badge group
      badges = Badge.where(badge_grouping_id: badge_group.id, enabled: true)
        .sort_by { |badge| sort_badges_by_requirement(badge) }
        .map do |badge|

          user_badge_count = UserBadge.where(badge_id: badge.id, user_id: user_id).count
          
          percent_complete = calculate_percent_complete(progress, badge.requirement.to_f)
          badge.as_json.merge(image_url: badge.image_url, user_badge: user_badge_count, percent_complete: percent_complete)
    end
  
      # Merge badge group attributes with its badges
      badge_group.attributes.merge({ badges: badges, progress: progress })
    end
    user_badges = UserBadge.joins(:badge).where(user_id: user_id)
    badge_counts = user_badges.group('badges.badge_type_id').count
    gold_count = badge_counts[1] || 0
    silver_count = badge_counts[2] || 0
    bronze_count = badge_counts[3] || 0
  
    render json: { badge_groups: badge_groups, gold_count: gold_count, silver_count: silver_count, bronze_count: bronze_count }
  end
  
  private

  def sort_badges_by_requirement(badge)
    begin
      Float(badge.requirement)
    rescue ArgumentError, TypeError
      nil
    end
  end
  def calculate_percent_complete(progress, requirement)
    return 0 if requirement.to_f <= 0

    division_result = progress.to_f / requirement.to_f
    division_result.nan? ? 0 : [division_result, 1].min*100
  end

  def execute_progress_query(query, user_id)
    begin
      #todo: maybe we can normalize to a percentage
      #check if matches target otherwise?
      placeholder_count = query.count('?')
      parameters = Array.new(placeholder_count, user_id)
      sanitized_query = ActiveRecord::Base.sanitize_sql_array([query, *parameters])
      result = ActiveRecord::Base.connection.exec_query(sanitized_query)
      result.rows.empty? ? nil : result.rows[0][0]
    rescue  
      nil
    end
  end

  def image_url
    upload_cdn_path(image_upload.url) if image_upload_id.present?
  end

end

# https://github.com/discourse/discourse/blob/main/app/controllers/user_badges_controller.rb