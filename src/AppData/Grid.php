<?php

namespace App\AppData;

class Grid
{
    /**
     * Size of grid.
     *
     * //Todo Make it customizable
     */
    const SIZE = 21;


    /**
     * @return int
     */
    public static function getSize(): int
    {
        return self::SIZE;
    }

}
