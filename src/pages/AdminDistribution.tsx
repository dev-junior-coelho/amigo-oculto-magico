import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Copy, MessageCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { getGroupMatches } from '@/db/api';
import type { MatchWithToken } from '@/types/types';

export default function AdminDistribution() {
  const { adminToken } = useParams<{ adminToken: string }>();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchWithToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!adminToken) {
      toast.error('Token de administrador inválido');
      navigate('/');
      return;
    }

    loadMatches();
  }, [adminToken, navigate]);

  const loadMatches = async () => {
    if (!adminToken) return;

    setIsLoading(true);
    try {
      const data = await getGroupMatches(adminToken);
      setMatches(data);
    } catch (error) {
      console.error('Erro ao carregar participantes:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao carregar participantes');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const getRevealUrl = (token: string) => {
    return `${window.location.origin}/revelar/${token}`;
  };

  const handleSendWhatsApp = (participant: MatchWithToken) => {
    const url = getRevealUrl(participant.token);
    const message = `🎁 *Amigo Oculto Mágico* 🎁\n\nOlá ${participant.participantName}!\n\nVocê foi sorteado(a) no Amigo Oculto! 🎉\n\nClique no link abaixo para descobrir quem você tirou:\n${url}\n\n✨ Mantenha segredo! ✨`;
    
    const whatsappUrl = `https://wa.me/${participant.participantPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyToken = (token: string) => {
    const url = getRevealUrl(token);
    navigator.clipboard.writeText(url);
    toast.success('Link copiado! 📋');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent via-background to-secondary flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="animate-spin text-6xl">⏳</div>
              <p className="text-lg text-muted-foreground">
                Carregando participantes...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-secondary p-4 xl:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 xl:w-10 xl:h-10 text-primary" />
              <h1 className="text-2xl xl:text-4xl font-bold text-foreground">
                Distribuir Links Mágicos
              </h1>
            </div>
            <p className="text-sm xl:text-base text-muted-foreground mt-2">
              Envie os links para cada participante via WhatsApp
            </p>
          </div>
          <div className="w-10 shrink-0" />
        </div>

        {/* Instruções */}
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Como Funciona
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm xl:text-base">
            <p>
              1️⃣ Clique no botão <strong className="text-primary">Enviar Link Mágico</strong> para abrir o WhatsApp
            </p>
            <p>
              2️⃣ A mensagem já estará pronta com o link personalizado
            </p>
            <p>
              3️⃣ Ou use <strong>Copiar Link</strong> para enviar manualmente
            </p>
            <p className="text-destructive font-semibold">
              ⚠️ Importante: Não revele o link de um participante para outro!
            </p>
          </CardContent>
        </Card>

        {/* Lista de Participantes */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              Participantes ({matches.length})
            </CardTitle>
            <CardDescription>
              Envie o link mágico para cada participante
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {matches.map((match, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <p className="font-bold text-lg text-foreground">
                          {match.participantName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {match.participantPhone}
                        </p>
                      </div>
                      <div className="flex flex-col xl:flex-row gap-2">
                        <Button
                          onClick={() => handleSendWhatsApp(match)}
                          className="flex-1"
                          size="lg"
                        >
                          <MessageCircle className="w-5 h-5 mr-2" />
                          Enviar Link Mágico 🟢
                        </Button>
                        <Button
                          onClick={() => handleCopyToken(match.token)}
                          variant="outline"
                          className="flex-1 xl:flex-none"
                          size="lg"
                        >
                          <Copy className="w-5 h-5 mr-2" />
                          Copiar Link
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Aviso Final */}
        <Card className="shadow-lg bg-accent border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-foreground">
                ✨ Sorteio Concluído! ✨
              </p>
              <p className="text-sm xl:text-base text-muted-foreground">
                Guarde este link para acessar novamente:
              </p>
              <div className="bg-background p-3 rounded-lg break-all text-xs xl:text-sm font-mono">
                {window.location.href}
              </div>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link de administração copiado! 📋');
                }}
                variant="outline"
                size="sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Link de Administração
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
