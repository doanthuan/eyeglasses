<?php namespace Doth\Catalog;

class ServiceProvider extends \Illuminate\Support\ServiceProvider {

	public function boot()
	{
		include __DIR__ . '/../../routes.php';
	}

	public function register()
	{
		$this->app->bind(
			'Doth\Catalog\Product\ProductRepositoryInterface',
			'Doth\Catalog\Product\ProductRepository'
		);

		$this->app->bind(
			'Doth\Catalog\Category\CategoryRepositoryInterface',
			'Doth\Catalog\Category\CategoryRepository'
		);

		$this->app->bind(
			'Doth\Catalog\Media\MediaRepositoryInterface',
			'Doth\Catalog\Media\MediaRepository'
		);

		$this->app->bind(
			'Doth\Catalog\Brand\BrandRepositoryInterface',
			'Doth\Catalog\Brand\BrandRepository'
		);
	}
}
