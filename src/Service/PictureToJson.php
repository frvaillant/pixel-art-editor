<?php

namespace App\Service;

use App\AppData\Grid;

/**
 * This class gets a picture form picture URL
 * It reduces it at Grid::SIZE * Grid::SIZE px size
 * Then analyze colors to build JSON
 */
class PictureToJson
{

    /**
     * @param string $imageUrl
     * @return false|array
     *
     * Get a picture URL generated bu AI.
     * Reduces it to Grid size
     * Returns each pixel's color
     */
    public function analyze(string $imageUrl): false|array
    {

        $imageData = file_get_contents($imageUrl);
        if ($imageData === false)
        {
            return false;
        }

        $image = imagecreatefromstring($imageData);
        if (!$image) {
            return false;
        }

        $width  = imagesx($image);
        $height = imagesy($image);

        $resized = imagecreatetruecolor(Grid::SIZE, Grid::SIZE);

        imagecopyresampled($resized, $image, 0, 0, 0, 0, Grid::SIZE, Grid::SIZE, $width, $height);

        $grid = [];

        $this->buildGrid($grid, $resized);

        imagedestroy($image);
        imagedestroy($resized);

        return $grid;

    }


    /**
     * @param array $grid
     * @param $resized
     * @return void
     *
     * Builds colors array
     */
    private function buildGrid(array &$grid, $resized): void
    {
        for ($y = 0; $y < Grid::SIZE; $y++) {
            $row = [];
            for ($x = 0; $x < Grid::SIZE; $x++) {
                $rgb = imagecolorat($resized, $x, $y);
                $row[$x] = $this->rgbIntToHex($rgb);

            }
            $grid[$y] = $row;

        }
    }

    /**
     * @param int $rgb
     * @return string
     *
     * Gets color as number and returns it as hexadecimal
     */
    private function rgbIntToHex(int $rgb): string {
        $r = ($rgb >> 16) & 0xFF;
        $g = ($rgb >> 8) & 0xFF;
        $b = $rgb & 0xFF;

        return sprintf("#%02X%02X%02X", $r, $g, $b);
    }
}
