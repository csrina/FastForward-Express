<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBillsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bills', function (Blueprint $table) {
            $table->increments('bill_id');
            $table->unsignedInteger('manifest_id')->nullable();
            $table->unsignedInteger('invoice_id')->nullable();
            $table->unsignedInteger('charge_account_id')->nullable();
            $table->unsignedInteger('pickup_account_id')->nullable();
            $table->unsignedInteger('delivery_account_id')->nullable();
            $table->unsignedInteger('pickup_address_id')->nullable();
            $table->unsignedInteger('delivery_address_id')->nullable();
            $table->unsignedInteger('reference_id')->nullable();
            $table->string('charge_reference_value')->nullable();
            $table->string('pickup_reference_value')->nullable();
            $table->string('delivery_reference_value')->nullable();
            $table->unsignedInteger('pickup_driver_id');
            $table->unsignedInteger('delivery_driver_id');
            $table->unsignedInteger('pickup_driver_commission');
            $table->unsignedInteger('delivery_driver_commission');
            $table->unsignedInteger('interliner_id')->nullable();
            $table->decimal('interliner_amount')->nullable();
            $table->string('bill_number');
            $table->string('description');
            $table->date('date');
            $table->decimal('amount');
            $table->boolean('is_manifested')->default(false);
            $table->boolean('is_invoiced')->default(false);

			$table->unique('bill_number');
			$table->foreign('manifest_id')->references('manifest_id')->on('manifests');
			$table->foreign('invoice_id')->references('invoice_id')->on('invoices');
			$table->foreign('charge_account_id')->references('account_id')->on('accounts');
			$table->foreign('pickup_account_id')->references('account_id')->on('accounts');
			$table->foreign('delivery_account_id')->references('account_id')->on('accounts');
			$table->foreign('pickup_address_id')->references('address_id')->on('addresses');
			$table->foreign('delivery_address_id')->references('address_id')->on('addresses');
			$table->foreign('reference_id')->references('reference_id')->on('references');
			$table->foreign('pickup_driver_id')->references('driver_id')->on('drivers');
            $table->foreign('delivery_driver_id')->references('driver_id')->on('drivers');
			$table->foreign('interliner_id')->references('interliner_id')->on('interliners');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('bills');
    }
}
