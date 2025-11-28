import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Copy, MessageCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { getGroupMatches } from '@/db/api';
import type { MatchWithToken } from '@/types/types';

import SEO from '@/components/common/SEO';

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
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <SEO title="Distribuir Links" />
        <Card className="w-full max-w-md shadow-glow rounded-2xl border-2 border-primary/30">
          <CardContent className="pt-8">
            <div className="text-center space-y-6">
              <div className="animate-spin text-7xl">⏳</div>
              <p className="text-xl text-muted-foreground font-semibold">
                Carregando participantes...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg p-4 xl:p-8">
      <SEO title="Distribuir Links" description="Distribua os links mágicos para os participantes do Amigo Oculto!" />
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="shrink-0 rounded-xl hover:bg-accent transition-smooth h-12 w-12"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-10 h-10 xl:w-12 xl:h-12 text-primary animate-pulse" />
              <h1 className="text-3xl xl:text-5xl font-bold gradient-text">
                Distribuir Links Mágicos
              </h1>
            </div>
            <p className="text-base xl:text-lg text-muted-foreground mt-3 font-medium">
              Envie os links para cada participante via WhatsApp
            </p>
          </div>
          <div className="w-12 shrink-0" />
        </div>

        {/* Instruções */}
        <Card className="shadow-elegant card-hover rounded-2xl border-2 border-primary/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <MessageCircle className="w-6 h-6 text-primary" />
              Como Funciona
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-base xl:text-lg">
            <p className="flex items-start gap-2">
              <span className="text-2xl">1️⃣</span>
              <span>Clique no botão <strong className="gradient-text">Enviar Link Mágico</strong> para abrir o WhatsApp</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-2xl">2️⃣</span>
              <span>A mensagem já estará pronta com o link personalizado</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-2xl">3️⃣</span>
              <span>Ou use <strong>Copiar Link</strong> para enviar manualmente</span>
            </p>
            <p className="text-destructive font-bold flex items-start gap-2 mt-4 p-3 bg-destructive/10 rounded-xl">
              <span className="text-2xl">⚠️</span>
              <span>Importante: Não revele o link de um participante para outro!</span>
            </p>
          </CardContent>
        </Card>

        {/* Lista de Participantes */}
        <Card className="shadow-elegant card-hover rounded-2xl border-2 border-border/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">
              Participantes ({matches.length})
            </CardTitle>
            <CardDescription className="text-base">
              Envie o link mágico para cada participante
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {matches.map((match, index) => (
                <Card key={index} className="border-2 border-border/50 shadow-elegant card-hover rounded-2xl overflow-hidden">
                  <div className="gradient-accent p-0.5">
                    <CardContent className="pt-6 bg-card rounded-xl">
                      <div className="space-y-4">
                        <div>
                          <p className="font-bold text-xl text-foreground">
                            {match.participantName}
                          </p>
                          <p className="text-base text-muted-foreground font-medium">
                            {match.participantPhone}
                          </p>
                        </div>
                        <div className="flex flex-col xl:flex-row gap-3">
                          <Button
                            onClick={() => handleSendWhatsApp(match)}
                            className="flex-1 h-14 rounded-xl text-base font-semibold gradient-primary hover:shadow-glow transition-smooth"
                            size="lg"
                          >
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Enviar Link Mágico 🟢
                          </Button>
                          <Button
                            onClick={() => handleCopyToken(match.token)}
                            variant="outline"
                            className="flex-1 xl:flex-none h-14 rounded-xl border-2 hover:border-primary transition-smooth"
                            size="lg"
                          >
                            <Copy className="w-5 h-5 mr-2" />
                            Copiar Link
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Aviso Final */}
        <Card className="shadow-glow rounded-2xl border-2 border-primary/30 backdrop-blur-sm overflow-hidden">
          <div className="gradient-secondary p-1">
            <CardContent className="pt-6 bg-card rounded-xl">
              <div className="text-center space-y-4">
                <p className="text-2xl font-bold gradient-text">
                  ✨ Sorteio Concluído! ✨
                </p>
                <p className="text-base xl:text-lg text-muted-foreground font-medium">
                  Guarde este link para acessar novamente:
                </p>
                <div className="bg-muted p-4 rounded-xl break-all text-sm xl:text-base font-mono border-2 border-border">
                  {window.location.href}
                </div>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link de administração copiado! 📋');
                  }}
                  variant="outline"
                  size="lg"
                  className="rounded-xl border-2 hover:border-primary transition-smooth h-12"
                >
                  <Copy className="w-5 h-5 mr-2" />
                  Copiar Link de Administração
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
