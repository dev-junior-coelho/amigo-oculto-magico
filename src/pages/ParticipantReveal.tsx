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
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-glow rounded-3xl border-2 border-primary/30 overflow-hidden">
          <div className="gradient-primary p-1">
            <CardContent className="pt-12 xl:pt-16 bg-card rounded-2xl">
              <div className="text-center space-y-8 xl:space-y-10">
                {/* Animação de Revelação */}
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-4">
                    <Sparkles className="w-16 h-16 xl:w-20 xl:h-20 text-primary animate-pulse" />
                    <Gift className="w-20 h-20 xl:w-24 xl:h-24 text-secondary" />
                    <Sparkles className="w-16 h-16 xl:w-20 xl:h-20 text-primary animate-pulse" />
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-2xl xl:text-3xl text-muted-foreground font-medium">
                      Olá, <strong className="gradient-text">{participantName}</strong>! 👋
                    </p>
                    <p className="text-xl xl:text-2xl text-muted-foreground font-medium">
                      Você tirou...
                    </p>
                  </div>

                  {/* Nome Revelado */}
                  <div className="relative">
                    <div className="absolute inset-0 gradient-accent blur-2xl opacity-30 rounded-3xl" />
                    <div className="relative gradient-accent p-8 xl:p-10 rounded-3xl border-2 border-primary/30 shadow-glow">
                      <p className="text-5xl xl:text-7xl mb-4">
                        🎁
                      </p>
                      <p className="text-4xl xl:text-6xl font-bold gradient-text break-words">
                        {assignedTo}
                      </p>
                    </div>
                  </div>

                  {/* Mensagem de Segredo */}
                  <div className="bg-accent/50 p-6 xl:p-8 rounded-2xl border-2 border-border backdrop-blur-sm">
                    <p className="text-xl xl:text-2xl font-bold gradient-text mb-3">
                      🤫 Mantenha em Segredo!
                    </p>
                    <p className="text-base xl:text-lg text-muted-foreground font-medium">
                      Não conte para ninguém quem você tirou. A magia do Amigo Oculto está na surpresa! ✨
                    </p>
                  </div>
                </div>

                {/* Botão para Voltar */}
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  size="lg"
                  className="w-full xl:w-auto h-14 rounded-xl border-2 hover:border-primary transition-smooth text-lg font-semibold"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Criar Novo Sorteio
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-glow rounded-3xl border-2 border-primary/30 overflow-hidden">
        <div className="gradient-secondary p-1">
          <div className="bg-card rounded-2xl">
            <CardHeader className="text-center pt-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Gift className="w-12 h-12 xl:w-14 xl:h-14 text-primary animate-pulse" />
                <Sparkles className="w-12 h-12 xl:w-14 xl:h-14 text-secondary animate-pulse" />
              </div>
              <CardTitle className="text-3xl xl:text-4xl gradient-text">
                Amigo Oculto Mágico
              </CardTitle>
              <CardDescription className="text-lg xl:text-xl mt-4 font-medium">
                {urlToken
                  ? 'Revelando seu Amigo Oculto...'
                  : 'Digite seu Token Mágico para revelar'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              {!urlToken && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="token" className="text-base font-semibold">Token Mágico</Label>
                    <Input
                      id="token"
                      value={manualToken}
                      onChange={(e) => setManualToken(e.target.value)}
                      placeholder="Cole seu token aqui..."
                      className="font-mono text-sm h-12 rounded-xl border-2 focus:border-primary transition-smooth"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleManualReveal();
                        }
                      }}
                    />
                    <p className="text-sm text-muted-foreground font-medium">
                      O token foi enviado para você via WhatsApp
                    </p>
                  </div>

                  <Button
                    onClick={handleManualReveal}
                    disabled={isRevealing || !manualToken.trim()}
                    className="w-full h-14 rounded-xl text-lg font-semibold gradient-primary hover:shadow-glow transition-smooth disabled:opacity-50"
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

                  <div className="pt-4 border-t-2 border-border">
                    <Button
                      onClick={() => navigate('/')}
                      variant="ghost"
                      className="w-full rounded-xl hover:bg-accent transition-smooth h-12"
                    >
                      <Home className="w-5 h-5 mr-2" />
                      Criar Novo Sorteio
                    </Button>
                  </div>
                </div>
              )}

              {urlToken && isRevealing && (
                <div className="text-center space-y-6 py-12">
                  <div className="animate-spin text-7xl">⏳</div>
                  <p className="text-xl text-muted-foreground font-semibold">
                    Descriptografando...
                  </p>
                </div>
              )}
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
