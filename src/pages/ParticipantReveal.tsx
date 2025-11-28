import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Gift, Sparkles, Eye, Home } from 'lucide-react';
import { revealMatch } from '@/db/api';

export default function ParticipantReveal() {
  const { token: urlToken } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [manualToken, setManualToken] = useState('');
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [participantName, setParticipantName] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
    // Se veio com token na URL, revela automaticamente
    if (urlToken) {
      handleReveal(urlToken);
    }
  }, [urlToken]);

  const handleReveal = async (token: string) => {
    if (!token.trim()) {
      toast.error('Digite o Token Mágico');
      return;
    }

    setIsRevealing(true);

    try {
      const result = await revealMatch(token.trim());
      
      setParticipantName(result.participantName);
      setAssignedTo(result.assignedTo);
      setRevealed(true);
      
      // Efeito sonoro de sucesso (opcional)
      toast.success('Revelado! 🎊');
    } catch (error) {
      console.error('Erro ao revelar:', error);
      toast.error(error instanceof Error ? error.message : 'Token inválido ou expirado');
    } finally {
      setIsRevealing(false);
    }
  };

  const handleManualReveal = () => {
    handleReveal(manualToken);
  };

  if (revealed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent via-background to-secondary flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-primary/30">
          <CardContent className="pt-8 xl:pt-12">
            <div className="text-center space-y-6 xl:space-y-8">
              {/* Animação de Revelação */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <Sparkles className="w-12 h-12 xl:w-16 xl:h-16 text-primary animate-pulse" />
                  <Gift className="w-16 h-16 xl:w-20 xl:h-20 text-primary" />
                  <Sparkles className="w-12 h-12 xl:w-16 xl:h-16 text-primary animate-pulse" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-xl xl:text-2xl text-muted-foreground">
                    Olá, <strong className="text-foreground">{participantName}</strong>! 👋
                  </p>
                  <p className="text-lg xl:text-xl text-muted-foreground">
                    Você tirou...
                  </p>
                </div>

                {/* Nome Revelado */}
                <div className="bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 p-6 xl:p-8 rounded-2xl border-2 border-primary/30">
                  <p className="text-4xl xl:text-6xl font-bold text-primary mb-2">
                    🎁
                  </p>
                  <p className="text-3xl xl:text-5xl font-bold text-foreground break-words">
                    {assignedTo}
                  </p>
                </div>

                {/* Mensagem de Segredo */}
                <div className="bg-accent p-4 xl:p-6 rounded-xl border border-border">
                  <p className="text-base xl:text-lg font-semibold text-foreground mb-2">
                    🤫 Mantenha em Segredo!
                  </p>
                  <p className="text-sm xl:text-base text-muted-foreground">
                    Não conte para ninguém quem você tirou. A magia do Amigo Oculto está na surpresa! ✨
                  </p>
                </div>
              </div>

              {/* Botão para Voltar */}
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="lg"
                className="w-full xl:w-auto"
              >
                <Home className="w-5 h-5 mr-2" />
                Criar Novo Sorteio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gift className="w-10 h-10 xl:w-12 xl:h-12 text-primary" />
            <Sparkles className="w-10 h-10 xl:w-12 xl:h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl xl:text-3xl">
            Amigo Oculto Mágico
          </CardTitle>
          <CardDescription className="text-base xl:text-lg">
            {urlToken
              ? 'Revelando seu Amigo Oculto...'
              : 'Digite seu Token Mágico para revelar'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!urlToken && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">Token Mágico</Label>
                <Input
                  id="token"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="Cole seu token aqui..."
                  className="font-mono text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleManualReveal();
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  O token foi enviado para você via WhatsApp
                </p>
              </div>

              <Button
                onClick={handleManualReveal}
                disabled={isRevealing || !manualToken.trim()}
                className="w-full"
                size="lg"
              >
                {isRevealing ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Revelando...
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 mr-2" />
                    Revelar Amigo Oculto ✨
                  </>
                )}
              </Button>

              <div className="pt-4 border-t border-border">
                <Button
                  onClick={() => navigate('/')}
                  variant="ghost"
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Criar Novo Sorteio
                </Button>
              </div>
            </div>
          )}

          {urlToken && isRevealing && (
            <div className="text-center space-y-4 py-8">
              <div className="animate-spin text-6xl">⏳</div>
              <p className="text-lg text-muted-foreground">
                Descriptografando...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
