# frozen_string_literal: true

class BadgeExtension::BadgeExtensionController < ApplicationController

  def my_badges
    user_id = current_user.id
  
    badge_groups = BadgeGrouping.where(show_progress: true).map do |badge_group|
      progress = execute_progress_query(badge_group.progress_query, user_id)

      # Fetch badges associated with the current badge group
      badges = Badge.where(badge_grouping_id: badge_group.id).map do |badge|

        badge.attributes.merge({ progress: progress })
      end
  
      # Merge badge group attributes with its badges
      badge_group.attributes.merge({ badges: badges })
    end
  
    render json: { badge_groups: badge_groups }
  end
  
  private

  def execute_progress_query(query, user_id)
    #todo: maybe we can normalize to a percentage
    #check if matches target otherwise?
    placeholder_count = query.count('?')
    parameters = Array.new(placeholder_count, user_id)
    sanitized_query = ActiveRecord::Base.sanitize_sql_array([query, *parameters])
    result = ActiveRecord::Base.connection.exec_query(sanitized_query)
    result.rows.empty? ? nil : result.rows[0][0]  
  end

end
