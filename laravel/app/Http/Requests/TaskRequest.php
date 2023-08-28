<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class TaskRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'description' => 'required|string|max:5000',
            'staff' => 'required|int',
            'assignee' => 'int|nullable',
            'status' => 'int',
        ];
    }

    
}
