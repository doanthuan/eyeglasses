<?php
namespace Doth\Catalog\Media;

use Str;
use Doth\Core\Abstracts\Model;

class Media extends Model{

	protected $table = 'media';
    protected $primaryKey = 'id';

    protected $fillable = array( 'filename', 'original_filename', 'default', 'product_id', 'color_id' );

}