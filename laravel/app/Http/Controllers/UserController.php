<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\EditRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\TaskRequest;
use App\Services\Methods;
use App\Services\TaskCreateService;
use App\Services\TaskDeleteService;
use App\Services\TaskEditService;
use App\Services\TaskGetService;
use App\Services\TaskService;
use App\Services\TaskUpdateService;
use App\Services\UserService;
use Illuminate\Http\Client\Request;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService, 

    ){}

    public function create(RegisterRequest $request) {

        return $this->userService->execute(Methods::POST, $request);

    }

    public function delete(int $userId) {

        return $this->userService->execute(Methods::DELETE, $userId);

    }
    public function update(int $userId, EditRequest $request) {

        return $this->userService->execute(Methods::PUT, $userId, $request->validated());

    }

    public function get(int $userId = null) {

        if($userId === null) return $this->userService->execute(methods::GET);
        
        return $this->userService->execute(Methods::GET, $userId);
        
    }


}