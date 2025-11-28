import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Trash2, Gift, Sparkles } from 'lucide-react';
import { createGroupAndDraw } from '@/db/api';
import type { Participant } from '@/types/types';

export default function AdminSetup() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('Amigo Oculto 2025');
  const [participantName, setParticipantName] = useState('');
  const [participantPhone, setParticipantPhone] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleAddParticipant = () => {
    if (!participantName.trim()) {
      toast.error('Digite o nome do participante');
      return;
    }

    if (!participantPhone.trim()) {
      toast.error('Digite o WhatsApp do participante');
      return;
    }

    // Validação básica de telefone (deve começar com +)
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(participantPhone.trim())) {
      toast.error('WhatsApp inválido. Use o formato: +5511999999999');
      return;
    }

    // Verifica duplicatas
    if (participants.some(p => p.phone === participantPhone.trim())) {
      toast.error('Este WhatsApp já foi adicionado');
      return;
    }

    setParticipants([...participants, {
      name: participantName.trim(),
      phone: participantPhone.trim()
    }]);

    setParticipantName('');
    setParticipantPhone('');
    toast.success('Participante adicionado! 🎉');
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
    toast.success('Participante removido');
  };

  const handleDraw = async () => {
    if (participants.length < 3) {
      toast.error('É necessário pelo menos 3 participantes');
      return;
    }

    if (!groupName.trim()) {
      toast.error('Digite o nome do grupo');
      return;
    }

    setIsDrawing(true);

    try {
      const result = await createGroupAndDraw(groupName.trim(), participants);
      
      toast.success('Sorteio realizado com sucesso! 🎊');
      
      // Navega para a página de distribuição com o admin token
      navigate(`/distribuir/${result.adminToken}`);
    } catch (error) {
      console.error('Erro ao realizar sorteio:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao realizar sorteio');
    } finally {
      setIsDrawing(false);
    }
  };

  const canDraw = participants.length >= 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-secondary p-4 xl:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Gift className="w-10 h-10 xl:w-12 xl:h-12 text-primary" />
            <h1 className="text-3xl xl:text-5xl font-bold text-foreground">
              Amigo Oculto Mágico
            </h1>
            <Sparkles className="w-10 h-10 xl:w-12 xl:h-12 text-primary" />
          </div>
          <p className="text-base xl:text-lg text-muted-foreground">
            Organize seu sorteio de forma segura e divertida! 🎁
          </p>
        </div>

        {/* Nome do Grupo */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Nome do Grupo</CardTitle>
            <CardDescription>
              Dê um nome especial para este sorteio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ex: Amigo Oculto da Família 2025"
              className="text-base xl:text-lg"
            />
          </CardContent>
        </Card>

        {/* Adicionar Participantes */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Adicionar Participantes</CardTitle>
            <CardDescription>
              Adicione pelo menos 3 participantes para realizar o sorteio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Participante</Label>
                <Input
                  id="name"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="Ex: João Silva"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      document.getElementById('phone')?.focus();
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp (com DDD)</Label>
                <Input
                  id="phone"
                  value={participantPhone}
                  onChange={(e) => setParticipantPhone(e.target.value)}
                  placeholder="+5511999999999"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddParticipant();
                    }
                  }}
                />
              </div>
            </div>
            <Button
              onClick={handleAddParticipant}
              className="w-full"
              size="lg"
            >
              Adicionar Participante ➕
            </Button>
          </CardContent>
        </Card>

        {/* Lista de Participantes */}
        {participants.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>
                Participantes ({participants.length})
              </CardTitle>
              <CardDescription>
                {canDraw
                  ? 'Tudo pronto! Você pode realizar o sorteio agora 🎉'
                  : `Adicione mais ${3 - participants.length} participante(s) para sortear`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {participants.map((participant, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 xl:p-4 bg-accent rounded-lg hover:bg-accent/80 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        {participant.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {participant.phone}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveParticipant(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botão de Sortear */}
        <Card className="shadow-lg border-primary/20">
          <CardContent className="pt-6">
            <Button
              onClick={handleDraw}
              disabled={!canDraw || isDrawing}
              className="w-full"
              size="lg"
            >
              {isDrawing ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Realizando Sorteio...
                </>
              ) : (
                <>
                  Sortear e Gerar Links Mágicos ✨
                </>
              )}
            </Button>
            {!canDraw && participants.length > 0 && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                Adicione pelo menos {3 - participants.length} participante(s)
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
