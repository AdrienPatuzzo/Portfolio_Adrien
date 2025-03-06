<?php

namespace App\Controller;

use App\Entity\Contact;
use App\Form\ContactType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;

class PortfolioController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(Request $request, MailerInterface $mailer): Response
    {
        // Informations du site
        $siteInfo = [
            'title' => 'Portfolio Adrien',
            'author' => 'Patuzzo ADRIEN',
            'year' => date('Y'),
            'description' => 'Portfolio sur le thème de fallout et matrix'
        ];

        // Menu items
        $menuItems = [
            ['route' => '#', 'label' => 'About'],
            ['route' => '#', 'label' => 'Skills'],
            ['route' => '#', 'label' => 'Work'],
            ['route' => 'https://www.linkedin.com/', 'label' => 'LinkedIn', 'external' => true],
            ['route' => '#', 'label' => 'Hobby'],
            ['route' => '#contact', 'label' => 'Contact']
        ];

        // Formulaire de contact
        $contact = new Contact();
        $form = $this->createForm(ContactType::class, $contact);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $email = (new Email())
                ->from($contact->getEmail())
                ->to('votre@email.com')
                ->subject('Contact Portfolio: ' . $contact->getSubject())
                ->text(
                    'De: ' . $contact->getName() . "\n" .
                        'Email: ' . $contact->getEmail() . "\n\n" .
                        $contact->getMessage()
                );

            try {
                $mailer->send($email);
                $this->addFlash('success', 'Votre message a été envoyé avec succès !');
            } catch (\Exception $e) {
                $this->addFlash('error', 'Une erreur est survenue lors de l\'envoi du message.');
            }

            return $this->redirectToRoute('app_home');
        }

        return $this->render('portfolio/index.html.twig', [
            'siteInfo' => $siteInfo,
            'menuItems' => $menuItems,
            'form' => $form->createView()
        ]);
    }
}
