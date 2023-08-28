<?php

namespace App\Services;

use App\Models\tasks;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\users;

class TaskDeleteService
{
    public function execute($request): mixed
    {
        $id = intval($request);

        $file = $this->delete($id);

        return $file;
    }

    public function delete(int $request): mixed
    {
        $task = tasks::where('id', '=', $request)->delete();
        


        return  $task;
    }
}
