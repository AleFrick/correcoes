
-- Schema (opcional)
CREATE DATABASE IF NOT EXISTS plataforma_ensino
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;
USE plataforma_ensino;

-- Limpeza ordenada (opcional, para reexecução)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS anexos_envio;
DROP TABLE IF EXISTS anexos_atividade;
DROP TABLE IF EXISTS comentarios;
DROP TABLE IF EXISTS correcoes;
DROP TABLE IF EXISTS envios;
DROP TABLE IF EXISTS atividades;
DROP TABLE IF EXISTS turma_membros;
DROP TABLE IF EXISTS turmas;
DROP TABLE IF EXISTS usuarios;
SET FOREIGN_KEY_CHECKS = 1;

-- =========================================
-- Tabela: usuarios
-- =========================================
CREATE TABLE usuarios (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome           VARCHAR(255) NOT NULL,
  email          VARCHAR(255) NOT NULL UNIQUE,
  senha_hash     VARCHAR(255) NOT NULL,

  role           ENUM('ADMIN', 'PROFESSOR', 'ALUNO') NOT NULL DEFAULT 'ALUNO',
  ativo          TINYINT(1) NOT NULL DEFAULT 1,

  criado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================
-- Tabela: turmas
-- =========================================
CREATE TABLE turmas (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome           VARCHAR(255) NOT NULL,
  codigo         VARCHAR(64) NOT NULL UNIQUE,   -- ex.: "TURMA-2025-01"
  descricao      TEXT NULL,
  inicio         DATE NULL,
  fim            DATE NULL,
  ativa          TINYINT(1) NOT NULL DEFAULT 1,

  criado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================
-- Tabela: turma_membros (vínculo usuário/turma)
-- =========================================
CREATE TABLE turma_membros (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  turma_id       BIGINT UNSIGNED NOT NULL,
  usuario_id     BIGINT UNSIGNED NOT NULL,
  papel          ENUM('PROFESSOR', 'ALUNO') NOT NULL,

  ingressou_em   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_turma_usuario_papel (turma_id, usuario_id, papel),

  CONSTRAINT fk_tm_turma
    FOREIGN KEY (turma_id)
    REFERENCES turmas (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_tm_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_tm_turma ON turma_membros (turma_id);
CREATE INDEX idx_tm_usuario ON turma_membros (usuario_id);

-- =========================================
-- Tabela: atividades (por turma)
-- =========================================
CREATE TABLE atividades (
  id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  turma_id             BIGINT UNSIGNED NOT NULL,
  titulo               VARCHAR(255) NOT NULL,
  descricao            TEXT NULL,

  data_publicacao      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_limite_entrega  DATETIME NULL,      -- <-- data limite de entrega (novo)

  max_nota             DECIMAL(5,2) NOT NULL DEFAULT 10.00,

  criado_por           BIGINT UNSIGNED NOT NULL,  -- usuário (professor)
  criado_em            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),

  CONSTRAINT fk_ativ_turma
    FOREIGN KEY (turma_id)
    REFERENCES turmas (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_ativ_prof
    FOREIGN KEY (criado_por)
    REFERENCES usuarios (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_ativ_turma ON atividades (turma_id);
CREATE INDEX idx_ativ_criado_por ON atividades (criado_por);
CREATE INDEX idx_ativ_data_limite ON atividades (data_limite_entrega);

-- =========================================
-- Tabela: envios (submissões dos alunos)
-- =========================================
-- Removidos campos de texto/arquivo, pois anexos ficam em 'anexos_envio'
CREATE TABLE envios (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  atividade_id    BIGINT UNSIGNED NOT NULL,
  aluno_id        BIGINT UNSIGNED NOT NULL,

  enviado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tentativa       INT NOT NULL DEFAULT 1,

  status          ENUM('RASCUNHO', 'ENVIADO', 'ATRASADO', 'CANCELADO') NOT NULL DEFAULT 'ENVIADO',

  -- (sem texto / sem arquivo_path aqui)

  criado_em       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_envio_unico (atividade_id, aluno_id, tentativa),

  CONSTRAINT fk_envio_atividade
    FOREIGN KEY (atividade_id)
    REFERENCES atividades (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_envio_aluno
    FOREIGN KEY (aluno_id)
    REFERENCES usuarios (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_envio_atividade_aluno ON envios (atividade_id, aluno_id);
CREATE INDEX idx_envio_status ON envios (status);

-- =========================================
-- Tabela: correcoes (avaliações de envios)
-- =========================================
CREATE TABLE correcoes (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  envio_id         BIGINT UNSIGNED NOT NULL,
  professor_id     BIGINT UNSIGNED NOT NULL,

  corrigido_em     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status           ENUM('PENDENTE', 'CORRIGIDO', 'REVISADO') NOT NULL DEFAULT 'CORRIGIDO',
  nota             DECIMAL(5,2) NULL,
  feedback_texto   LONGTEXT NULL,

  criado_em        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),

  CONSTRAINT fk_corr_envio
    FOREIGN KEY (envio_id)
    REFERENCES envios (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_corr_prof
    FOREIGN KEY (professor_id)
    REFERENCES usuarios (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_corr_envio ON correcoes (envio_id);
CREATE INDEX idx_corr_prof ON correcoes (professor_id);

-- =========================================
-- Tabela: comentarios (chat da atividade)
-- =========================================
-- Agora pode servir como chat geral da atividade (atividade_id) ou
-- conversa ligada a um envio específico (envio_id opcional).
CREATE TABLE comentarios (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  atividade_id      BIGINT UNSIGNED NOT NULL,
  envio_id          BIGINT UNSIGNED NULL,   -- opcional: para threads vinculadas ao envio
  autor_usuario_id  BIGINT UNSIGNED NOT NULL,

  mensagem          TEXT NOT NULL,
  respondeu_a_id    BIGINT UNSIGNED NULL,   -- opcional: ID de comentário ao qual se está respondendo (thread)
  criado_em         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),

  CONSTRAINT fk_coment_atividade
    FOREIGN KEY (atividade_id)
    REFERENCES atividades (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_coment_envio
    FOREIGN KEY (envio_id)
    REFERENCES envios (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_coment_autor
    FOREIGN KEY (autor_usuario_id)
    REFERENCES usuarios (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_coment_reply
    FOREIGN KEY (respondeu_a_id)
    REFERENCES comentarios (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_coment_atividade ON comentarios (atividade_id, criado_em);
CREATE INDEX idx_coment_envio ON comentarios (envio_id, criado_em);
CREATE INDEX idx_coment_autor ON comentarios (autor_usuario_id, criado_em);

-- =========================================
-- Tabelas de anexos
-- =========================================
CREATE TABLE anexos_atividade (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  atividade_id   BIGINT UNSIGNED NOT NULL,
  path           VARCHAR(512) NOT NULL,
  nome_original  VARCHAR(255) NULL,
  mime_type      VARCHAR(255) NULL,
  tamanho_bytes  BIGINT UNSIGNED NULL,

  criado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),

  CONSTRAINT fk_ax_ativ
    FOREIGN KEY (atividade_id)
    REFERENCES atividades (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_ax_ativ ON anexos_atividade (atividade_id);

CREATE TABLE anexos_envio (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  envio_id       BIGINT UNSIGNED NOT NULL,
  path           VARCHAR(512) NOT NULL,
  nome_original  VARCHAR(255) NULL,
  mime_type      VARCHAR(255) NULL,
  tamanho_bytes  BIGINT UNSIGNED NULL,

  criado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),

  CONSTRAINT fk_ax_envio
    FOREIGN KEY (envio_id)
    REFERENCES envios (id)
       ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

