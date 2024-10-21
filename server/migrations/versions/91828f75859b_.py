"""empty message

Revision ID: 91828f75859b
Revises: 98bd85463ef9
Create Date: 2024-10-20 16:11:50.299060

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '91828f75859b'
down_revision = '98bd85463ef9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('booking',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('client_id', sa.Integer(), nullable=False),
    sa.Column('therapist_id', sa.Integer(), nullable=False),
    sa.Column('appointment_date', sa.DateTime(), nullable=False),
    sa.Column('status', sa.String(length=20), nullable=True),
    sa.ForeignKeyConstraint(['client_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['therapist_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('booking')
    # ### end Alembic commands ###