<?php

namespace App\Models;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class tasks_progress extends Model {
    use HasFactory;

    protected $fillable = [
        'name',
        'status',
        'user_id',
        'task_id',
    ];


 
}
