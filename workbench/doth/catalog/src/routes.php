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
Route::post('product/delete', 'Doth\Catalog\Controllers\ProductController@delete');
Route::get('product/get-by-alias/{alias}', 'Doth\Catalog\Controllers\ProductController@getByAlias');

Route::resource('category', 'Doth\Catalog\Controllers\CategoryController');
Route::post('category/delete', 'Doth\Catalog\Controllers\CategoryController@delete');

Route::resource('media', 'Doth\Catalog\Controllers\MediaController');
Route::post('media/upload', 'Doth\Catalog\Controllers\MediaController@upload');

Route::resource('brand', 'Doth\Catalog\Controllers\BrandController');
Route::post('brand/delete', 'Doth\Catalog\Controllers\BrandController@delete');