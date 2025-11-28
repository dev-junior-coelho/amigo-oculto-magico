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
    <div className="min-h-screen gradient-bg p-4 xl:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-in fade-in duration-700">
          <div className="flex items-center justify-center gap-3">
            <Gift className="w-12 h-12 xl:w-16 xl:h-16 text-primary animate-pulse" />
            <h1 className="text-4xl xl:text-6xl font-bold gradient-text">
              Amigo Oculto Mágico
            </h1>
            <Sparkles className="w-12 h-12 xl:w-16 xl:h-16 text-secondary animate-pulse" />
          </div>
          <p className="text-lg xl:text-xl text-muted-foreground font-medium">
            Organize seu sorteio de forma segura e divertida! 🎁
          </p>
        </div>

        {/* Nome do Grupo */}
        <Card className="shadow-elegant card-hover rounded-2xl border-2 border-border/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Nome do Grupo</CardTitle>
            <CardDescription className="text-base">
              Dê um nome especial para este sorteio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ex: Amigo Oculto da Família 2025"
              className="text-base xl:text-lg h-12 rounded-xl border-2 focus:border-primary transition-smooth"
            />
          </CardContent>
        </Card>

        {/* Adicionar Participantes */}
        <Card className="shadow-elegant card-hover rounded-2xl border-2 border-border/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Adicionar Participantes</CardTitle>
            <CardDescription className="text-base">
              Adicione pelo menos 3 participantes para realizar o sorteio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">Nome do Participante</Label>
                <Input
                  id="name"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="h-12 rounded-xl border-2 focus:border-primary transition-smooth"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      document.getElementById('phone')?.focus();
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-semibold">WhatsApp (com DDD)</Label>
                <Input
                  id="phone"
                  value={participantPhone}
                  onChange={(e) => setParticipantPhone(e.target.value)}
                  placeholder="+5511999999999"
                  className="h-12 rounded-xl border-2 focus:border-primary transition-smooth"
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
              className="w-full h-14 rounded-xl text-lg font-semibold gradient-primary hover:shadow-glow transition-smooth"
              size="lg"
            >
              Adicionar Participante ➕
            </Button>
          </CardContent>
        </Card>

        {/* Lista de Participantes */}
        {participants.length > 0 && (
          <Card className="shadow-elegant card-hover rounded-2xl border-2 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">
                Participantes ({participants.length})
              </CardTitle>
              <CardDescription className="text-base">
                {canDraw
                  ? 'Tudo pronto! Você pode realizar o sorteio agora 🎉'
                  : `Adicione mais ${3 - participants.length} participante(s) para sortear`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {participants.map((participant, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 xl:p-5 bg-gradient-to-r from-accent/50 to-accent/30 rounded-2xl hover:from-accent/70 hover:to-accent/50 transition-smooth border border-border/30 card-hover"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-lg text-foreground">
                        {participant.name}
                      </p>
                      <p className="text-sm text-muted-foreground font-medium">
                        {participant.phone}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveParticipant(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl transition-smooth h-10 w-10"
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
        <Card className="shadow-glow rounded-2xl border-2 border-primary/30 backdrop-blur-sm overflow-hidden">
          <div className="gradient-primary p-1">
            <CardContent className="pt-6 bg-card rounded-xl">
              <Button
                onClick={handleDraw}
                disabled={!canDraw || isDrawing}
                className="w-full h-16 rounded-xl text-base xl:text-xl font-bold gradient-secondary hover:shadow-glow transition-smooth disabled:opacity-50 px-4"
                size="lg"
              >
                {isDrawing ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    <span className="max-sm:text-sm">Realizando Sorteio...</span>
                  </>
                ) : (
                  <>
                    <span className="max-sm:text-sm">Sortear e Gerar Links ✨</span>
                    <span className="hidden xl:inline"> Mágicos</span>
                  </>
                )}
              </Button>
              {!canDraw && participants.length > 0 && (
                <p className="text-center text-sm text-muted-foreground mt-3 font-medium">
                  Adicione pelo menos {3 - participants.length} participante(s)
                </p>
              )}
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
