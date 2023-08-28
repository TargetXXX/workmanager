<?php

namespace App\Models;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class tasks extends Model {
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'column',
        'staff',
        'assignee',
        'status',
    ];


 
}
