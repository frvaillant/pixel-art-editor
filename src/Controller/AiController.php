<?php

namespace App\Controller;

use App\Prompts\IaPrompts;
use App\Service\PictureToJson;
use OpenAI\Client;
use Psr\Cache\InvalidArgumentException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Cache\CacheItem;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

final class AiController extends AbstractController
{
    /**
     * @throws InvalidArgumentException
     */
    #[Route('/ai/{subject}', name: 'app_ai')]
    public function index(
        Client $client,
        string $subject,
        PictureToJson $pictureToJson,
        CacheInterface $cache
    ): Response {


        $url = $cache->get($subject, function(ItemInterface $item ) use ($client, $subject) {

            $item->expiresAfter(300);

            $prompt = sprintf(IaPrompts::PIXEL_ART_PROMPT, $subject);

            $response = $client->images()->create([
                'model' => 'dall-e-2',
                'prompt' => $prompt,
                'n' => 1,
                'size' => '1024x1024',
            ]);

            $responseData = $response->toArray();

            return $responseData['data'][0]['url'];
        });

        if ($grid = $pictureToJson->analyze($url)) {
            return new JsonResponse(['grid' => $grid, 'imageSrc' => $url], Response::HTTP_OK);
        }

        return new JsonResponse([], Response::HTTP_NO_CONTENT);

    }
}
