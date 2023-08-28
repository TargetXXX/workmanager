<?php

namespace App\Services;

use App\Models\tasks;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\users;

class TaskCreateService
{
    public function execute(object $request): mixed
    {
        $file = $this->create($request);

        return $file;
    }

    public function create(object $request): mixed
    {
        $request = tasks::create([
            'name' => $request->name,
            'description' => $request->description,
            'staff' => $request->staff,
        ]);

        return $request->toArray();
    }
}
