<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Services\LoginService;

class LoginController extends Controller
{
    public function __construct(
        private LoginService $loginService
    ){}

    public function __invoke(LoginRequest $request)
    {
        $response = $this->loginService->execute($request);
        return $response;
    }
}