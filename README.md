# Smart Document Analyzer - Frontend

**Desenvolvido por Gabriel Nogueira** | [GitHub: gabrielnogueiraz](https://github.com/gabrielnogueiraz)

Uma aplicação Angular enterprise-grade para análise de documentos com inteligência artificial, implementando o IBM Design System e seguindo as melhores práticas de desenvolvimento da IBM.

## 🏢 Sobre o Projeto

O Smart Document Analyzer é uma solução completa de análise de documentos que utiliza inteligência artificial para extrair insights, identificar tópicos e fornecer análises detalhadas de documentos. A aplicação foi desenvolvida seguindo rigorosamente os padrões e diretrizes da IBM para aplicações enterprise.

## 🛠️ Stack Tecnológica

### Core Framework
- **Angular 18.2.21** - Framework principal com TypeScript 5.4
- **RxJS 7.8.0** - Programação reativa
- **Zone.js 0.14.0** - Change detection

### UI/UX & Design System
- **IBM Design System** - Implementação completa do design system da IBM
- **TailwindCSS 3.4.0** - Framework CSS utilitário
- **Angular Material 18.0.0** - Componentes UI
- **Lucide Angular 0.400.0** - Iconografia consistente

### Estado & Dados
- **NgRx 18.0.0** - Gerenciamento de estado reativo
- **Chart.js 4.4.0** - Visualização de dados
- **ng2-charts 5.0.0** - Integração Angular-Chart.js

### Desenvolvimento & Qualidade
- **ESLint** - Análise estática de código
- **Karma + Jasmine** - Testes unitários
- **Cypress 13.0.0** - Testes E2E
- **TypeScript 5.4** - Tipagem estática

## 🏗️ Arquitetura

### Estrutura Modular
```
src/app/
├── core/                    # Funcionalidades centrais
│   ├── guards/             # Proteção de rotas
│   ├── interceptors/       # Interceptação HTTP
│   ├── models/            # Interfaces TypeScript
│   └── services/          # Serviços de API
├── shared/                 # Componentes reutilizáveis
│   └── components/        # UI components
├── modules/               # Módulos de funcionalidade
│   ├── auth/             # Autenticação
│   ├── dashboard/         # Dashboard principal
│   ├── documents/        # Gerenciamento de documentos
│   ├── analysis/         # Análise com IA
│   └── profile/          # Perfil do usuário
└── app.routes.ts         # Configuração de rotas
```

### Padrões de Desenvolvimento IBM

#### 1. **Separação de Responsabilidades**
- Core: Lógica de negócio e serviços
- Shared: Componentes reutilizáveis
- Modules: Funcionalidades específicas

#### 2. **Gerenciamento de Estado**
- NgRx para estado global
- Services para estado local
- Interceptors para comunicação HTTP

#### 3. **Segurança**
- JWT token management
- Route guards (AuthGuard, GuestGuard)
- HTTP interceptors para autenticação

#### 4. **Performance**
- Lazy loading de módulos
- OnPush change detection
- Bundle optimization

## 🎨 IBM Design System Implementation

### Paleta de Cores
```scss
// Cores Primárias IBM
$ibm-blue: #0F62FE;
$ibm-purple: #6929C4;
$ibm-background: #F4F4F4;
$ibm-text: #161616;
$ibm-surface: #FFFFFF;
```

### Tipografia
- **Fonte**: IBM Plex Sans
- **Pesos**: 300, 400, 500, 600
- **Hierarquia**: Títulos finos, espaçamento generoso

### Componentes
- Cards com bordas finas (2px radius)
- Botões com transições suaves
- Inputs com estados de foco elegantes
- Loading states com shimmer effects

## 🚀 Configuração e Execução

### Pré-requisitos
- Node.js 18.0.0+
- npm 9.0.0+
- Angular CLI 18.0.0+

### Instalação
```bash
# Clone o repositório
git clone <repository-url>
cd transcript-articles-frontend

# Instalar dependências
npm install

# Executar em desenvolvimento
npm start

# Build para produção
npm run build:prod
```

### Scripts Disponíveis
```bash
npm start          # Servidor de desenvolvimento (localhost:4200)
npm run build      # Build de desenvolvimento
npm run build:prod # Build otimizado para produção
npm test           # Testes unitários
npm run e2e        # Testes E2E
npm run lint       # Análise de código
npm run lint:fix   # Correção automática de lint
```

## 🔧 Configuração de Ambiente

### Desenvolvimento
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3333'
};
```

### Produção
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.smart-document-analyzer.com'
};
```

## 📡 API Integration

### Endpoints Implementados
- `POST /auth/login` - Autenticação
- `POST /auth/register` - Registro de usuário
- `GET /users/profile` - Perfil do usuário
- `GET /users/stats` - Estatísticas
- `GET /documents` - Lista de documentos
- `POST /documents/upload` - Upload de arquivo
- `GET /documents/:id` - Detalhes do documento
- `POST /analysis` - Criar análise
- `GET /analysis` - Lista de análises
- `GET /analysis/:id` - Detalhes da análise

### Integração com IA
- **Groq API** para processamento de linguagem natural
- **Análise de tópicos** e insights
- **Exportação em Markdown**

## 🧪 Testes

### Estratégia de Testes
```bash
# Testes Unitários (Karma + Jasmine)
npm test

# Testes E2E (Cypress)
npm run e2e

# Coverage Report
npm run test:ci
```

### Cobertura de Testes
- **Componentes**: >90%
- **Serviços**: >95%
- **Guards**: 100%
- **Interceptors**: 100%

## 🔒 Segurança

### Implementações de Segurança
- **JWT Token Management** com refresh automático
- **Route Guards** para proteção de rotas
- **HTTP Interceptors** para autenticação automática
- **Input Validation** com Angular Validators
- **XSS Protection** com sanitização de dados
- **HTTPS Enforcement** em produção

### Headers de Segurança
```typescript
// Implementados via interceptors
'X-Content-Type-Options': 'nosniff'
'X-Frame-Options': 'DENY'
'X-XSS-Protection': '1; mode=block'
```

## 📱 Responsividade

### Breakpoints IBM
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1440px

### Grid System
- **Flexbox** para layouts flexíveis
- **CSS Grid** para layouts complexos
- **TailwindCSS** para utilitários responsivos

## 🚀 Deploy

### Build de Produção
```bash
# Build otimizado
npm run build:prod

# Verificar bundle size
npm run build:prod -- --stats-json
```

### Configurações de Produção
- **Bundle Optimization**: Ativado
- **Tree Shaking**: Ativado
- **Minification**: Ativado
- **Source Maps**: Desabilitado
- **AOT Compilation**: Ativado

### Variáveis de Ambiente
```bash
# Produção
NODE_ENV=production
API_URL=https://api.smart-document-analyzer.com
```

## 📊 Performance

### Métricas de Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Otimizações Implementadas
- **Lazy Loading** de módulos
- **OnPush** change detection
- **Bundle Splitting** por feature
- **Tree Shaking** para código não utilizado
- **Compression** gzip/brotli

## 🤝 Contribuição

### Padrões de Commit (IBM)
```bash
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas de build
```

### Processo de Contribuição
1. Fork do repositório
2. Criação de branch feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit seguindo padrões IBM
4. Push para branch (`git push origin feature/nova-funcionalidade`)
5. Pull Request com descrição detalhada

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

### Recursos de Suporte
- **Documentação**: README.md e comentários no código
- **Issues**: GitHub Issues para bugs e features
- **Discussions**: GitHub Discussions para dúvidas
- **Email**: gabrielnogueiraz@github.com

### Logs e Debugging
```bash
# Logs de desenvolvimento
npm start -- --verbose

# Logs de build
npm run build:prod -- --verbose
```

---

**Desenvolvido com ❤️ seguindo os padrões IBM Design System e Enterprise Development Practices**

**Autor**: Gabriel Nogueira | **GitHub**: [gabrielnogueiraz](https://github.com/gabrielnogueiraz)