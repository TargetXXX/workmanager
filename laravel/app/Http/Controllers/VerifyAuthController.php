<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VerifyAuthController extends Controller
{
    public function __construct()
    {
    }

    public function __invoke(Request $request)
    {

        if (!Auth::check()) return response()->json(['message' => 'Usuario não logado.', 'auth' => 'false']);
        $user = $request->user();
        $user->senha = $user->password;
        return response()->json(['user' => $user, 'message' => 'Usuario logado.', 'auth' => 'true']);

    }
}
