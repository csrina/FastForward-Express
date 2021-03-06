<?php

use Illuminate\Database\Seeder;

class CommissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('commissions')->insert([
            "employee_id" => 1,
            "account_id" => 1,
            "commission" => 0.05,
            "depreciation_amount" => 0.02,
            "years" => 2,
            "start_date" => new Carbon\Carbon('first day of last month'),
        ]);

        DB::table('commissions')->insert([
            "employee_id" => 2,
            "account_id" => 1,
            "commission" => 0.07,
            "depreciation_amount" => 0.01,
            "years" => 5,
            "start_date" => new Carbon\Carbon('first day of last month'),
        ]);
    }
}
