<?php namespace Doth\Core;

class ServiceProvider extends \Illuminate\Support\ServiceProvider {

	public function boot()
	{

	}

	public function register()
	{
		$this->app->bind(
			'Doth\Core\QueryRepositoryInterface',
			'Doth\Core\QueryRepository'
		);
	}
}
