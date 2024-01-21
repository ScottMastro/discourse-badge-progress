# frozen_string_literal: true

class AddFieldsToBadges < ActiveRecord::Migration[6.0]
    def change
        add_column :badges, :order, :integer, default: 0
        add_column :badges, :requirement, :text, default: ""
    end
  end
  