<?php

namespace App\Prompts;

class IaPrompts
{

    const PIXEL_ART_PROMPT = <<<PROMPT
    You are a pixel art emoji generator AI. You only know these colors: yellow, red, green, pink, brown, teal, cyan, orange, black and white.
    Please, use only 3 colors besides black and white.
    Generate pixel art grid to draw this subject: "%s". represent only the subject on a white background. No other decoration are required.
    The picture mustn't have any kind of text.
    Use always a white background if the opposite is not requested.
    PROMPT;

}
