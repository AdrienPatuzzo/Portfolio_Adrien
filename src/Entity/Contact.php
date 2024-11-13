<?php

namespace App\Entity;

use Symfony\Component\Validator\Constraints as Assert;

class Contact
{
    #[Assert\NotBlank(message: 'Le nom est obligatoire')]
    private ?string $name = null;

    #[Assert\NotBlank(message: 'L\'email est obligatoire')]
    #[Assert\Email(message: 'L\'email {{ value }} n\'est pas valide')]
    private ?string $email = null;

    #[Assert\NotBlank(message: 'Le sujet est obligatoire')]
    private ?string $subject = null;

    #[Assert\NotBlank(message: 'Le message est obligatoire')]
    #[Assert\Length(min: 10, minMessage: 'Votre message doit faire au moins {{ limit }} caractères')]
    private ?string $message = null;

    // Getters et Setters
    public function getName(): ?string
    {
        return $this->name;
    }
    public function setName(?string $name): self
    {
        $this->name = $name;
        return $this;
    }
    public function getEmail(): ?string
    {
        return $this->email;
    }
    public function setEmail(?string $email): self
    {
        $this->email = $email;
        return $this;
    }
    public function getSubject(): ?string
    {
        return $this->subject;
    }
    public function setSubject(?string $subject): self
    {
        $this->subject = $subject;
        return $this;
    }
    public function getMessage(): ?string
    {
        return $this->message;
    }
    public function setMessage(?string $message): self
    {
        $this->message = $message;
        return $this;
    }
}