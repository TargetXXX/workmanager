<?php

namespace App\Services;

use App\Models\tasks;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\users;

class TaskGetService
{
    public function execute(int $taskId = null): mixed
    {

        if($taskId === null) return $this->get();


        return $this->get($taskId);

    }

    public function get(int $taskId = null): mixed
    {

        if($taskId === null) return tasks::all();

        return tasks::find($taskId);

    }
}
