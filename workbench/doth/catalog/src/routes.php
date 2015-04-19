<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function(){
	return File::get(public_path() . '/angular.html');
});

Route::resource('product', 'Doth\Catalog\Controllers\ProductController');

Route::resource('category', 'Doth\Catalog\Controllers\CategoryController');
Route::delete('category', 'Doth\Catalog\Controllers\CategoryController@delete');