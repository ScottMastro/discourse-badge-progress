# frozen_string_literal: true

class AddOrderToBadges < ActiveRecord::Migration[6.0]
    def change
        add_column :badges, :order, :integer, default: 0
        add_column :badges, :allow_claim, :boolean, default: false
        add_column :badges, :requirement, :text, default: ""
    end
  end
  