# 网络聊天系统架构图 - Mermaid版本

## 技术架构详细图

```mermaid
graph TB
    subgraph "前端技术栈 (Frontend Stack)"
        React[React + TypeScript]
        Tailwind[Tailwind CSS]
        AntDesign[Ant Design]
        SocketClient[Socket.io Client]
        HTTPClient[HTTP API Axios]
        
        React --> Tailwind
        React --> AntDesign
        React --> SocketClient
        React --> HTTPClient
    end

    subgraph "后端技术栈 (Backend Stack)"
        NodeJS[Node.js]
        Express[Express.js]
        SocketServer[Socket.io Server]
        JWT[JWT认证]
        Bcrypt[Bcrypt加密]
        
        NodeJS --> Express
        NodeJS --> SocketServer
        Express --> JWT
        Express --> Bcrypt
    end

    subgraph "通信协议 (Communication)"
        WebSocket[WebSocket]
        HTTP[HTTP API]
        REST[RESTful API]
        
        WebSocket --> SocketClient
        WebSocket --> SocketServer
        HTTP --> HTTPClient
        HTTP --> REST
    end

    SocketClient -.->|实时通信| SocketServer
    HTTPClient -.->|API请求| REST
    Express --> REST

    subgraph "数据库层 (Database Layer)"
        MongoDB[(MongoDB)]
        Mongoose[Mongoose ODM]
        Users[(用户表 Users)]
        Contacts[(好友表 Contacts)]
        Messages[(消息表 Messages)]
        Groups[(群组表 Groups)]
        
        MongoDB --> Mongoose
        Mongoose --> Users
        Mongoose --> Contacts
        Mongoose --> Messages
        Mongoose --> Groups
    end

    REST --> Mongoose
    SocketServer --> Mongoose

    classDef frontend fill:#e3f2fd
    classDef backend fill:#f3e5f5
    classDef database fill:#e8f5e8
    classDef communication fill:#fff3e0

    class React,Tailwind,AntDesign,SocketClient,HTTPClient frontend
    class NodeJS,Express,SocketServer,JWT,Bcrypt backend
    class MongoDB,Mongoose,Users,Contacts,Messages,Groups database
    class WebSocket,HTTP,REST communication
```

## 系统功能模块图

```mermaid
graph LR
    subgraph "用户管理模块"
        Auth[用户认证]
        Profile[用户资料]
        Status[在线状态]
        
        Auth --> Profile
        Profile --> Status
    end

    subgraph "好友管理模块"
        AddFriend[添加好友]
        FriendList[好友列表]
        FriendStatus[好友状态]
        
        AddFriend --> FriendList
        FriendList --> FriendStatus
    end

    subgraph "聊天模块"
        PrivateChat[私聊]
        GroupChat[群聊]
        MessageHistory[消息历史]
        
        PrivateChat --> MessageHistory
        GroupChat --> MessageHistory
    end

    subgraph "群组管理模块"
        CreateGroup[创建群组]
        GroupMember[群组成员]
        GroupPermission[群组权限]
        
        CreateGroup --> GroupMember
        GroupMember --> GroupPermission
    end

    Auth --> AddFriend
    FriendList --> PrivateChat
    FriendList --> CreateGroup
    GroupMember --> GroupChat

    classDef userModule fill:#e1f5fe
    classDef friendModule fill:#f3e5f5
    classDef chatModule fill:#e8f5e8
    classDef groupModule fill:#fff3e0

    class Auth,Profile,Status userModule
    class AddFriend,FriendList,FriendStatus friendModule
    class PrivateChat,GroupChat,MessageHistory chatModule
    class CreateGroup,GroupMember,GroupPermission groupModule
```

## 数据流程图

```mermaid
flowchart TD
    A[用户登录] --> B{验证用户}
    B -->|成功| C[建立WebSocket连接]
    B -->|失败| D[返回错误信息]
    
    C --> E[获取好友列表]
    C --> F[获取群组列表]
    C --> G[获取离线消息]
    
    E --> H[实时好友状态更新]
    F --> I[群组消息监听]
    G --> J[消息历史记录]
    
    K[发送消息] --> L{消息类型}
    L -->|私聊| M[路由到目标用户]
    L -->|群聊| N[广播到群组成员]
    
    M --> O[消息存储]
    N --> O
    O --> P[消息状态更新]
    
    H --> Q[UI状态更新]
    I --> Q
    J --> Q
    P --> Q
    
    classDef start fill:#e8f5e8
    classDef process fill:#e3f2fd
    classDef decision fill:#fff3e0
    classDef end fill:#fce4ec
    
    class A start
    class C,E,F,G,H,I,J,K,M,N,O,P,Q process
    class B,L decision
    class D end
```

## 系统部署架构图

```mermaid
graph TB
    subgraph "客户端 (Client)"
        WebApp[Web应用]
        MobileApp[移动应用]
    end

    subgraph "负载均衡器 (Load Balancer)"
        Nginx[Nginx]
    end

    subgraph "应用服务器 (Application Server)"
        App1[Node.js App 1]
        App2[Node.js App 2]
        App3[Node.js App 3]
    end

    subgraph "数据库集群 (Database Cluster)"
        Mongo1[(MongoDB Primary)]
        Mongo2[(MongoDB Secondary 1)]
        Mongo3[(MongoDB Secondary 2)]
    end

    subgraph "缓存层 (Cache Layer)"
        Redis[(Redis Cache)]
    end

    subgraph "文件存储 (File Storage)"
        FileServer[文件服务器]
    end

    WebApp --> Nginx
    MobileApp --> Nginx
    Nginx --> App1
    Nginx --> App2
    Nginx --> App3
    
    App1 --> Mongo1
    App2 --> Mongo1
    App3 --> Mongo1
    
    Mongo1 --> Mongo2
    Mongo1 --> Mongo3
    
    App1 --> Redis
    App2 --> Redis
    App3 --> Redis
    
    App1 --> FileServer
    App2 --> FileServer
    App3 --> FileServer

    classDef client fill:#e1f5fe
    classDef loadBalancer fill:#f3e5f5
    classDef appServer fill:#e8f5e8
    classDef database fill:#fff3e0
    classDef cache fill:#fce4ec
    classDef storage fill:#f1f8e9

    class WebApp,MobileApp client
    class Nginx loadBalancer
    class App1,App2,App3 appServer
    class Mongo1,Mongo2,Mongo3 database
    class Redis cache
    class FileServer storage
```

## 安全架构图

```mermaid
graph TB
    subgraph "客户端安全"
        HTTPS[HTTPS加密]
        TokenStorage[Token存储]
        InputValidation[输入验证]
    end

    subgraph "传输层安全"
        SSL[SSL/TLS]
        WebSocketSecure[WebSocket Secure]
    end

    subgraph "应用层安全"
        JWT[JWT认证]
        PasswordHash[密码哈希]
        RateLimit[速率限制]
        CORS[CORS策略]
    end

    subgraph "数据层安全"
        DataEncryption[数据加密]
        Backup[数据备份]
        AccessControl[访问控制]
    end

    HTTPS --> SSL
    TokenStorage --> JWT
    InputValidation --> RateLimit
    
    SSL --> WebSocketSecure
    JWT --> PasswordHash
    RateLimit --> CORS
    
    WebSocketSecure --> DataEncryption
    PasswordHash --> Backup
    CORS --> AccessControl

    classDef clientSecurity fill:#e1f5fe
    classDef transportSecurity fill:#f3e5f5
    classDef appSecurity fill:#e8f5e8
    classDef dataSecurity fill:#fff3e0

    class HTTPS,TokenStorage,InputValidation clientSecurity
    class SSL,WebSocketSecure transportSecurity
    class JWT,PasswordHash,RateLimit,CORS appSecurity
    class DataEncryption,Backup,AccessControl dataSecurity
```
