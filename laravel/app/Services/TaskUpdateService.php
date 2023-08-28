<?php

namespace App\Services;

use App\Models\tasks;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\users;

class TaskUpdateService
{
    public function execute(int $id, $request): mixed
    {

        $file = $this->update($id, $request);

        return $file;
    }

    public function update(int $id, $request): mixed
    {

        $task = tasks::find($id);

        if($task) $task->update($request);

        return  $task->toArray();
    }
}
