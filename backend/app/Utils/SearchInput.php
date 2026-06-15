<?php

namespace App\Utils;

class SearchInput
{
    public static function escape(?string $term, int $maxLength = 100): ?string
    {
        if ($term === null || $term === '') {
            return null;
        }

        $term = mb_substr(trim($term), 0, $maxLength);

        return str_replace(['%', '_'], ['\\%', '\\_'], $term);
    }
}
