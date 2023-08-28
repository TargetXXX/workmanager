<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\users;

class LoginService
{
    public function execute(object $request): mixed
    {
        $file = $this->login($request);

        return $file;
    }

    public function login(object $request): mixed
    {
        $user = users::where('username', $request->username)
            ->orWhere('email', $request->username)
            ->first();

        if (Hash::check($request->password, $user->password)) {
            
            $token = $user->createToken('authToken')->plainTextToken;
            $_SESSION['token'] = $token;
            return response()->json(['message' => 'Login bem-sucedido', 'token' => $token]);
        }

        return response()->json(['message' => 'Credenciais inválidas'], 401);
    }
}
