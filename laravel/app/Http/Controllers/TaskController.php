<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskRequest;
use App\Services\TaskCreateService;
use App\Services\TaskDeleteService;
use App\Services\TaskEditService;
use App\Services\TaskGetService;
use App\Services\TaskService;
use App\Services\TaskUpdateService;

class TaskController extends Controller
{
    public function __construct(
        private TaskCreateService $taskCreate, 
        private TaskDeleteService $taskDelete,
        private TaskUpdateService $taskUpdate,
        private TaskGetService $taskGet
    ){}

    public function create(TaskRequest $request) {
        $response = $this->taskCreate->execute($request);
        return $response;
    }
    public function delete(int $taskId) {
        $response = $this->taskDelete->execute($taskId);
        return $response;
    }
    public function update(int $taskId, TaskRequest $request) {
        $response = $this->taskUpdate->execute($taskId, $request->validated());

        return $response;
    }

    public function get(int $taskId = null) {



        if($taskId === null) return $this->taskGet->execute();

        return $this->taskGet->execute($taskId);
        
    }

}