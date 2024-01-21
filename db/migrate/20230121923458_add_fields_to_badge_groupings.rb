# frozen_string_literal: true

class AddFieldsToBadgeGroupings < ActiveRecord::Migration[6.0]
    def change
        add_column :badge_groupings, :show_progress, :boolean, default: false
        add_column :badge_groupings, :is_quantitative, :boolean, default: false
        add_column :badge_groupings, :units, :text, default: ""
        add_column :badge_groupings, :allow_claim, :boolean, default: false
        add_column :badge_groupings, :progress_query, :text, default: nil
    end
  end
  