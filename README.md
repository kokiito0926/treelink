## treelink

treelinkは、treeの実行結果をHTMLに変換することができるコマンドラインのツールです。  
静的なウェブサイトをデプロイして、ファイル一覧を確認するようなときに最適です。

## インストール

```bash
$ npm install --global @kokiito0926/treelink
```

## 使用方法

treeの実行結果が標準入力から与えられると、HTMLに変換します。

```bash
$ tree . -L 2 | treelink
```

--baseのオプションを用いると、リンクの起点を設定できます。

```bash
$ tree . -L 2 | treelink --base "./src"
```

treeeにも対応しているので、treeがインストールされていない環境でも利用できます。

```bash
$ npx treee . -L 2 | treelink
```

## ライセンス

[MIT](LICENSE)
