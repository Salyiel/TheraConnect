"""empty message

Revision ID: 67a99aac9a10
Revises: ec375fa882c6
Create Date: 2024-10-19 17:28:59.302255

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '67a99aac9a10'
down_revision = 'ec375fa882c6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_verified', sa.Boolean(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('is_verified')

    # ### end Alembic commands ###