<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class PixelArtController extends AbstractController
{
    #[Route('/pixel-art', name: 'app_pixel_art')]
    public function index(): Response
    {
        return $this->render('pixel_art/index.html.twig', [

        ]);
    }
}
