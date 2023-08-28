<?php

namespace App\Services;

use App\Models\users;

class RegisterService
{
    public function execute(object $request): array
    {
        $file = $this->register($request);

        return $file;
    }

    public function register(object $request): array
    {

        $request = users::create([
            'name' => $request->name,
            'group'  => $request->group,
            'email'  => $request->email,
            'username'=> $request->username,
            'password'=> bcrypt($request->password),
        ]);
        
        return $request->toArray();
    }
}