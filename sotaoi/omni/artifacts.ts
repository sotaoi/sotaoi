import Joi from 'joi';

class Artifact {
  public repository: string;
  public uuid: string;
  public ref: RecordRef;
  public serial: string;

  constructor(repository: string, uuid: string) {
    this.repository = repository;
    this.uuid = uuid;
    this.ref = new RecordRef(repository, uuid);
    this.serial = this.ref.serialize(null);
  }
}

class AuthRecord extends Artifact {
  public createdAt: Date;
  public active: boolean;

  constructor(repository: string, uuid: string, createdAt: Date, active: boolean) {
    super(repository, uuid);

    this.repository = repository;
    this.uuid = uuid;
    this.createdAt = createdAt;
    this.active = active;
  }

  public static deserialize(value: { repository: string; uuid: string; createdAt: Date; active: boolean }): AuthRecord {
    Joi.object({
      repository: Joi.string(),
      uuid: Joi.string(),
      createdAt: Joi.date(),
      accessToken: Joi.string(),
      active: Joi.boolean(),
    }).validate(value);
    return new AuthRecord(value.repository, value.uuid, value.createdAt, value.active);
  }
}

class RecordRef {
  public repository: string;
  public uuid: string;

  constructor(repository: string, uuid: string) {
    if (typeof repository !== 'string' || typeof uuid !== 'string') {
      throw new Error('bad record ref');
    }
    this.repository = repository;
    this.uuid = uuid;
  }

  public isEmpty(): boolean {
    return false;
  }

  public deserialize(value: string): RecordRef {
    return RecordRef.deserialize(value);
  }

  public serialize(forStorage: any): string {
    return JSON.stringify({ repository: this.repository, uuid: this.uuid });
  }

  public static deserialize(value: string): RecordRef {
    const parsed = JSON.parse(value);
    if (typeof parsed !== 'object' || typeof parsed.repository !== 'string' || typeof parsed.uuid !== 'string') {
      throw new Error('failed to parse record ref');
    }
    return new RecordRef(parsed.repository, parsed.uuid);
  }
}

class RecordEntry {
  [key: string]: any;
  public uuid: string;

  constructor(uuid: string) {
    this.uuid = uuid;
  }
}

class Artifacts {
  public child: null | Artifact;
  public parent: null | Artifact;
  public subject: null | Artifact;
  public inviter: null | Artifact;
  public invitee: null | Artifact;
  public agent: null | Artifact;
  public target: null | Artifact;
  public children: null | Artifact[];
  public parents: null | Artifact[];
  public subjects: null | Artifact[];
  public inviters: null | Artifact[];
  public invitees: null | Artifact[];
  public agents: null | Artifact[];
  public targets: null | Artifact[];
  // list A, B, C, D

  constructor(
    artifacts: {
      child?: null | Artifact;
      parent?: null | Artifact;
      subject?: null | Artifact;
      inviter?: null | Artifact;
      invitee?: null | Artifact;
      agent?: null | Artifact;
      target?: null | Artifact;
      children?: Artifact[];
      parents?: Artifact[];
      subjects?: Artifact[];
      inviters?: Artifact[];
      invitees?: Artifact[];
      agents?: Artifact[];
      targets?: Artifact[];
    } = {},
  ) {
    this.child = artifacts.child || null;
    this.parent = artifacts.parent || null;
    this.subject = artifacts.subject || null;
    this.inviter = artifacts.inviter || null;
    this.invitee = artifacts.invitee || null;
    this.agent = artifacts.agent || null;
    this.target = artifacts.target || null;
    this.children = artifacts.children || null;
    this.parents = artifacts.parents || null;
    this.subjects = artifacts.subjects || null;
    this.inviters = artifacts.inviters || null;
    this.invitees = artifacts.invitees || null;
    this.agents = artifacts.agents || null;
    this.targets = artifacts.targets || null;
  }
}

export { Artifact, AuthRecord, RecordRef, RecordEntry, Artifacts };
