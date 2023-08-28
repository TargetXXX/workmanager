<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Models\Task;
use App\Models\tasks;

class DeleteFinishedTasks extends Command
{
    protected $signature = 'tasks:delete-finished';
    protected $description = 'Delete finished tasks older than 1 minute';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $thresholdTime = Carbon::now()->subMinutes(1);

        tasks::where('status', 2)
            ->where('updated_at', '<', $thresholdTime)->update(['status' => 3]);

        $this->info('Tarefas finalizadas a mais de 1 minutos foram deletadas.');
    }
}

