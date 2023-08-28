<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'username' => 'required|string|min:4|max:16|regex:/^[a-zA-Z0-9.]+$/|not_regex:/\s/',
            'email' => 'required|email|min:4|max:200',
            'password' => ['required', 'confirmed', Password::min(3)->letters()->numbers()->symbols()],
            'name' => 'required|string|min:4|max:100|regex:/^[a-zA-Z\s]+$/|not_regex:/^\s*$/',
            'group' => 'required|string',
        ];
    }

    
}
